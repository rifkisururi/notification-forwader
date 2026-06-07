import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/notification_payload.dart';

class Preferences {
  static const String _keyApiBaseUrl = 'api_base_url';
  static const String _keyApiEndpoint = 'api_endpoint';
  static const String _keyApiToken = 'api_token';
  static const String _keyMonitoredPackages = 'monitored_packages';
  static const String _keyNotificationLogs = 'notification_logs';

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
}
