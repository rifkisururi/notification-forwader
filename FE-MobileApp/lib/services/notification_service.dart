import 'dart:async';
import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import '../models/notification_payload.dart';
import '../utils/preferences.dart';
import 'api_service.dart';

class NotificationService {
  static const MethodChannel _channel = MethodChannel('com.example.notif/notifications');
  
  static final List<VoidCallback> _listeners = [];
  
  // Keep track of recently processed notifications in memory to prevent duplicates during the app session.
  static final Set<String> _processedKeys = {};

  static void addListener(VoidCallback listener) {
    _listeners.add(listener);
  }

  static void removeListener(VoidCallback listener) {
    _listeners.remove(listener);
  }

  static void _notifyListeners() {
    for (final listener in _listeners) {
      try {
        listener();
      } catch (e) {
        debugPrint('Error notifying listener: $e');
      }
    }
  }

  /// Initialize MethodChannel handlers and check for queued background notifications
  static Future<void> initialize() async {
    _channel.setMethodCallHandler((MethodCall call) async {
      switch (call.method) {
        case 'onNotification':
          final String jsonStr = call.arguments;
          await _handleIncomingNotification(jsonStr);
          break;
        default:
          debugPrint('Unknown method channel call: ${call.method}');
      }
    });

    // Flush any pending notifications that occurred before engine was initialized
    try {
      await _channel.invokeMethod('flushNotifications');
    } on PlatformException catch (e) {
      debugPrint('Failed to flush notifications: $e');
    }
  }

  /// Check if the notification listener service permission is granted
  static Future<bool> checkPermission() async {
    try {
      final bool granted = await _channel.invokeMethod('isPermissionGranted');
      return granted;
    } on PlatformException catch (e) {
      debugPrint('Error checking notification permission: $e');
      return false;
    }
  }

  /// Open Android system notification listener settings
  static Future<void> openPermissionSettings() async {
    try {
      await _channel.invokeMethod('openNotificationSettings');
    } on PlatformException catch (e) {
      debugPrint('Error opening notification settings: $e');
    }
  }

  /// Update the monitored packages list in both Kotlin service and Preferences
  static Future<void> updateMonitoredPackages(List<String> packages) async {
    await Preferences.setMonitoredPackages(packages);
    try {
      await _channel.invokeMethod('updateMonitoredPackages', {'packages': packages});
    } on PlatformException catch (e) {
      debugPrint('Error sending monitored packages to Android service: $e');
    }
  }

  /// Parse, deduplicate, log, and forward incoming notifications
  static Future<void> _handleIncomingNotification(String jsonStr) async {
    try {
      final Map<String, dynamic> jsonMap = jsonDecode(jsonStr);
      
      // Inject device_name from local Preferences
      final devName = Preferences.deviceName;
      if (devName.isNotEmpty) {
        jsonMap['device_name'] = devName;
      }
      
      final payload = NotificationPayload.fromJson(jsonMap);

      // Create compound deduplication key: package_name:notif_id
      // In Android, notif_id can be 0 or repeating for different apps. 
      // Using package name + notif_id + text ensures perfect unique filtering.
      final uniqueKey = '${payload.sourceApp}:${payload.notifId}:${payload.text}';
      
      if (_processedKeys.contains(uniqueKey)) {
        debugPrint('Duplicate notification detected and ignored: $uniqueKey');
        return;
      }

      // Add to processed set
      _processedKeys.add(uniqueKey);
      // Keep set size reasonable
      if (_processedKeys.length > 500) {
        _processedKeys.remove(_processedKeys.first);
      }

      // Generate a unique ID for local log entry
      final String logId = '${payload.notifId}_${DateTime.now().millisecondsSinceEpoch}';
      
      // Extract financial nominal if parseable
      final nominal = NotificationLogEntry.parseNominal(payload.text, payload.bigText);

      final logEntry = NotificationLogEntry(
        id: logId,
        payload: payload,
        status: NotificationStatus.sending,
        nominal: nominal,
      );

      // Add to preferences/log history and notify UI
      await Preferences.addNotificationLog(logEntry);
      _notifyListeners();

      // Begin forwarding in background
      _forwardWithRetry(logEntry);

    } catch (e) {
      debugPrint('Error parsing notification JSON: $e');
    }
  }

  /// Handles forwarding logic with configurable retries and delays
  static Future<void> _forwardWithRetry(NotificationLogEntry entry) async {
    final maxAttempts = Preferences.maxRetries;
    final delaySeconds = Preferences.retryDelay;
    
    int attempt = 0;
    bool success = false;
    
    while (attempt <= maxAttempts && !success) {
      if (attempt > 0) {
        debugPrint('Forward failed for notification ${entry.payload.notifId}. Retrying attempt $attempt/$maxAttempts in $delaySeconds seconds...');
        await Future.delayed(Duration(seconds: delaySeconds));
      }
      
      success = await ApiService.forward(entry.payload);
      if (success) {
        break;
      }
      
      attempt++;
    }
    
    if (success) {
      entry.status = NotificationStatus.sent;
      entry.error = null;
    } else {
      entry.status = NotificationStatus.failed;
      entry.error = 'Failed after $maxAttempts retry attempts';
    }
    
    await Preferences.updateNotificationLog(entry);
    _notifyListeners();
  }

  /// Manually retry forwarding a failed notification log entry
  static Future<void> retryForward(NotificationLogEntry entry) async {
    entry.status = NotificationStatus.sending;
    entry.error = null;
    await Preferences.updateNotificationLog(entry);
    _notifyListeners();
    
    // Asynchronously trigger forwarding to avoid blocking the caller
    _forwardWithRetry(entry);
  }
}
