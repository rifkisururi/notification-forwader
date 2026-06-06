import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/notification_payload.dart';
import '../utils/preferences.dart';

class ApiService {
  /// Forwards a notification payload to the configured server.
  static Future<bool> forward(NotificationPayload payload) async {
    final baseUrl = Preferences.apiBaseUrl;
    final endpoint = Preferences.apiEndpoint;
    final token = Preferences.apiToken;

    if (baseUrl.isEmpty) {
      return false;
    }

    // Ensure URL ends properly
    final cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.substring(0, baseUrl.length - 1) : baseUrl;
    final cleanEndpoint = endpoint.startsWith('/') ? endpoint : '/$endpoint';
    final fullUrl = '$cleanBaseUrl$cleanEndpoint';

    try {
      final res = await http.post(
        Uri.parse(fullUrl),
        headers: {
          'Content-Type': 'application/json',
          if (token.isNotEmpty) 'Authorization': 'Bearer $token',
        },
        body: jsonEncode(payload.toJson()),
      ).timeout(const Duration(seconds: 10));

      return res.statusCode >= 200 && res.statusCode < 300;
    } catch (_) {
      return false;
    }
  }

  /// Tests the connection to the configured server with a dummy payload.
  /// Returns a Map containing success state, status code, and message.
  static Future<Map<String, dynamic>> testConnection(String baseUrl, String endpoint, String token) async {
    if (baseUrl.isEmpty) {
      return {'success': false, 'message': 'API URL cannot be empty'};
    }

    final cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.substring(0, baseUrl.length - 1) : baseUrl;
    final cleanEndpoint = endpoint.startsWith('/') ? endpoint : '/$endpoint';
    final fullUrl = '$cleanBaseUrl$cleanEndpoint';

    final dummyPayload = NotificationPayload(
      sourceApp: 'com.example.notif',
      sourceAppLabel: 'NotifForwarderTest',
      title: 'Connection Test',
      text: 'Testing REST API connection',
      bigText: 'Testing REST API connection from Flutter client',
      receivedAt: DateTime.now().toUtc().toIso8601String(),
      notifId: 99999,
    );

    try {
      final res = await http.post(
        Uri.parse(fullUrl),
        headers: {
          'Content-Type': 'application/json',
          if (token.isNotEmpty) 'Authorization': 'Bearer $token',
        },
        body: jsonEncode(dummyPayload.toJson()),
      ).timeout(const Duration(seconds: 10));

      final isOk = res.statusCode >= 200 && res.statusCode < 300;
      return {
        'success': isOk,
        'statusCode': res.statusCode,
        'message': isOk 
            ? 'Success (Status ${res.statusCode})' 
            : 'Server returned error status ${res.statusCode}',
      };
    } catch (e) {
      return {
        'success': false,
        'message': 'Connection failed: ${e.toString()}',
      };
    }
  }
}
