import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/notification_payload.dart';
import '../models/forward_target.dart';

class Preferences {
  static const String _keyApiBaseUrl = 'api_base_url';
  static const String _keyApiEndpoint = 'api_endpoint';
  static const String _keyApiToken = 'api_token';
  static const String _keyMonitoredPackages = 'monitored_packages';
  static const String _keyNotificationLogs = 'notification_logs';
  static const String _keyMaxRetries = 'max_retries';
  static const String _keyRetryDelay = 'retry_delay';
  static const String _keyDeviceName = 'device_name';

  static SharedPreferences? _prefs;

  static Future<void> init() async {
    _prefs = await SharedPreferences.getInstance();
  }

  static SharedPreferences get prefs {
    if (_prefs == null) {
      throw Exception('Preferences not initialized. Call Preferences.init() first.');
    }
    return _prefs!;
  }

  // API Base URL
  static String get apiBaseUrl {
    return prefs.getString(_keyApiBaseUrl) ?? '';
  }

  static Future<void> setApiBaseUrl(String value) async {
    await prefs.setString(_keyApiBaseUrl, value.trim());
  }

  // API Endpoint
  static String get apiEndpoint {
    return prefs.getString(_keyApiEndpoint) ?? '/api/notification';
  }

  static Future<void> setApiEndpoint(String value) async {
    await prefs.setString(_keyApiEndpoint, value.trim());
  }

  // API Bearer Token
  static String get apiToken {
    return prefs.getString(_keyApiToken) ?? '';
  }

  static Future<void> setApiToken(String value) async {
    await prefs.setString(_keyApiToken, value.trim());
  }

  // Device Name
  static String get deviceName {
    return prefs.getString(_keyDeviceName) ?? '';
  }

  static Future<void> setDeviceName(String value) async {
    await prefs.setString(_keyDeviceName, value.trim());
  }

  // Max Retries
  static int get maxRetries {
    return prefs.getInt(_keyMaxRetries) ?? 3;
  }

  static Future<void> setMaxRetries(int value) async {
    await prefs.setInt(_keyMaxRetries, value);
  }

  // Retry Delay (seconds)
  static int get retryDelay {
    return prefs.getInt(_keyRetryDelay) ?? 5;
  }

  static Future<void> setRetryDelay(int value) async {
    await prefs.setInt(_keyRetryDelay, value);
  }

  // Monitored packages
  static List<String> get monitoredPackages {
    // SharedPreferences string set is stored differently. We can get it or use string list.
    // SharedPreferences getStringList or getStringSet works on Android. In flutter it is getStringList.
    return prefs.getStringList(_keyMonitoredPackages) ?? [];
  }

  static Future<void> setMonitoredPackages(List<String> packages) async {
    await prefs.setStringList(_keyMonitoredPackages, packages);
  }

  // Notification Logs
  static List<NotificationLogEntry> get notificationLogs {
    final list = prefs.getStringList(_keyNotificationLogs) ?? [];
    return list.map((item) {
      try {
        return NotificationLogEntry.fromJson(jsonDecode(item));
      } catch (_) {
        return null;
      }
    }).whereType<NotificationLogEntry>().toList();
  }

  static Future<void> saveNotificationLogs(List<NotificationLogEntry> logs) async {
    final list = logs.map((log) => jsonEncode(log.toJson())).toList();
    await prefs.setStringList(_keyNotificationLogs, list);
  }

  static Future<void> addNotificationLog(NotificationLogEntry entry) async {
    final logs = notificationLogs;
    // Prepend to show latest first
    logs.insert(0, entry);
    // Limit to last 500 entries to prevent memory / storage bloat
    if (logs.length > 500) {
      logs.removeRange(500, logs.length);
    }
    await saveNotificationLogs(logs);
  }

  static Future<void> updateNotificationLog(NotificationLogEntry entry) async {
    final logs = notificationLogs;
    final index = logs.indexWhere((item) => item.id == entry.id);
    if (index != -1) {
      logs[index] = entry;
      await saveNotificationLogs(logs);
    }
  }

  static Future<void> clearNotificationLogs() async {
    await prefs.remove(_keyNotificationLogs);
  }

  static const String _keyForwardTargets = 'forward_targets';

  static List<ForwardTarget> get forwardTargets {
    final list = prefs.getStringList(_keyForwardTargets) ?? [];
    if (list.isEmpty) {
      final dbUrl = apiBaseUrl;
      if (dbUrl.isNotEmpty) {
        final defaultTarget = ForwardTarget(
          id: 'default_api',
          name: 'Default REST API',
          type: ForwardTargetType.api,
          isEnabled: true,
          config: {
            'baseUrl': dbUrl,
            'endpoint': apiEndpoint,
            'token': apiToken,
          },
        );
        return [defaultTarget];
      }
      return [];
    }
    return list.map((item) {
      try {
        return ForwardTarget.fromJson(jsonDecode(item));
      } catch (_) {
        return null;
      }
    }).whereType<ForwardTarget>().toList();
  }

  static Future<void> saveForwardTargets(List<ForwardTarget> targets) async {
    final list = targets.map((t) => jsonEncode(t.toJson())).toList();
    await prefs.setStringList(_keyForwardTargets, list);
  }
}
