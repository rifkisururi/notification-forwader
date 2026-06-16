import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/notification_payload.dart';
import '../models/forward_target.dart';
import '../utils/preferences.dart';

class ApiService {
  /// Forwards a notification payload to the configured server (Legacy method).
  static Future<bool> forward(NotificationPayload payload) async {
    final baseUrl = Preferences.apiBaseUrl;
    final endpoint = Preferences.apiEndpoint;
    final token = Preferences.apiToken;

    if (baseUrl.isEmpty) {
      return false;
    }

    final legacyTarget = ForwardTarget(
      id: 'legacy',
      name: 'Legacy API',
      type: ForwardTargetType.api,
      config: {
        'baseUrl': baseUrl,
        'endpoint': endpoint,
        'token': token,
      },
    );

    final result = await forwardToTarget(payload, legacyTarget);
    return result.success;
  }

  /// Forwards a notification payload to a specific target.
  static Future<ForwardResult> forwardToTarget(NotificationPayload payload, ForwardTarget target) async {
    if (!target.isEnabled) {
      return ForwardResult(
        success: false,
        url: '',
        response: 'Target is disabled',
      );
    }

    switch (target.type) {
      case ForwardTargetType.api:
        return _forwardToApi(payload, target);
      case ForwardTargetType.telegram:
        return _forwardToTelegram(payload, target);
      case ForwardTargetType.whatsapp:
        return _forwardToWhatsapp(payload, target);
    }
  }

  static Future<ForwardResult> _forwardToApi(NotificationPayload payload, ForwardTarget target) async {
    final baseUrl = target.config['baseUrl'] ?? '';
    final endpoint = target.config['endpoint'] ?? '/api/notification';
    final token = target.config['token'] ?? '';

    if (baseUrl.isEmpty) {
      return ForwardResult(
        success: false,
        url: '',
        response: 'URL is empty',
      );
    }

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

      final success = res.statusCode >= 200 && res.statusCode < 300;
      return ForwardResult(
        success: success,
        url: fullUrl,
        response: 'Status: ${res.statusCode}, Body: ${res.body}',
      );
    } catch (e) {
      return ForwardResult(
        success: false,
        url: fullUrl,
        response: 'Error: ${e.toString()}',
      );
    }
  }

  static Future<ForwardResult> _forwardToTelegram(NotificationPayload payload, ForwardTarget target) async {
    final botToken = target.config['botToken'] ?? '';
    final chatId = target.config['chatId'] ?? '';
    final customTemplate = target.config['customTemplate'];

    if (botToken.isEmpty || chatId.isEmpty) {
      return ForwardResult(
        success: false,
        url: 'https://api.telegram.org/bot<token>/sendMessage',
        response: 'Bot Token or Chat ID is empty',
      );
    }

    final message = _formatMessage(payload, customTemplate);
    final displayUrl = 'https://api.telegram.org/bot${botToken.length > 6 ? "${botToken.substring(0, 6)}..." : "<token>"}/sendMessage';
    final actualUrl = 'https://api.telegram.org/bot$botToken/sendMessage';

    try {
      final res = await http.post(
        Uri.parse(actualUrl),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'chat_id': chatId,
          'text': message,
          'parse_mode': 'Markdown',
        }),
      ).timeout(const Duration(seconds: 10));

      final success = res.statusCode >= 200 && res.statusCode < 300;
      return ForwardResult(
        success: success,
        url: displayUrl,
        response: 'Status: ${res.statusCode}, Body: ${res.body}',
      );
    } catch (e) {
      return ForwardResult(
        success: false,
        url: displayUrl,
        response: 'Error: ${e.toString()}',
      );
    }
  }

  static Future<ForwardResult> _forwardToWhatsapp(NotificationPayload payload, ForwardTarget target) async {
    final phoneNumberId = target.config['phoneNumberId'] ?? '';
    final accessToken = target.config['accessToken'] ?? '';
    final recipientPhone = target.config['recipientPhone'] ?? '';
    final customTemplate = target.config['customTemplate'];

    final displayUrl = 'https://graph.facebook.com/v19.0/$phoneNumberId/messages';

    if (phoneNumberId.isEmpty || accessToken.isEmpty || recipientPhone.isEmpty) {
      return ForwardResult(
        success: false,
        url: displayUrl,
        response: 'Phone Number ID, Access Token, or Recipient Phone is empty',
      );
    }

    final message = _formatMessage(payload, customTemplate);

    try {
      final res = await http.post(
        Uri.parse('https://graph.facebook.com/v19.0/$phoneNumberId/messages'),
        headers: {
          'Authorization': 'Bearer $accessToken',
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'messaging_product': 'whatsapp',
          'recipient_type': 'individual',
          'to': recipientPhone,
          'type': 'text',
          'text': {
            'preview_url': false,
            'body': message,
          },
        }),
      ).timeout(const Duration(seconds: 10));

      final success = res.statusCode >= 200 && res.statusCode < 300;
      return ForwardResult(
        success: success,
        url: displayUrl,
        response: 'Status: ${res.statusCode}, Body: ${res.body}',
      );
    } catch (e) {
      return ForwardResult(
        success: false,
        url: displayUrl,
        response: 'Error: ${e.toString()}',
      );
    }
  }

  static String _formatMessage(NotificationPayload payload, String? customTemplate) {
    final template = (customTemplate != null && customTemplate.trim().isNotEmpty)
        ? customTemplate
        : '🔔 *Notification Forwarded*\n'
            '*App:* {source_app_label}\n'
            '*Title:* {title}\n'
            '*Message:* {text}\n'
            '*Amount:* {nominal}\n'
            '*Time:* {received_at}\n'
            '*Device:* {device_name}';

    final nominal = NotificationLogEntry.parseNominal(payload.text, payload.bigText) ?? 'None';
    final deviceName = payload.deviceName ?? 'Unknown';

    return template
        .replaceAll('{source_app}', payload.sourceApp)
        .replaceAll('{source_app_label}', payload.sourceAppLabel)
        .replaceAll('{title}', payload.title)
        .replaceAll('{text}', payload.text)
        .replaceAll('{big_text}', payload.bigText)
        .replaceAll('{nominal}', nominal)
        .replaceAll('{received_at}', payload.receivedAt)
        .replaceAll('{device_name}', deviceName);
  }

  /// Tests the connection to the configured server with a dummy payload.
  static Future<Map<String, dynamic>> testConnection(String baseUrl, String endpoint, String token) async {
    if (baseUrl.isEmpty) {
      return {'success': false, 'message': 'API URL cannot be empty'};
    }

    final cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.substring(0, baseUrl.length - 1) : baseUrl;
    final cleanEndpoint = endpoint.startsWith('/') ? endpoint : '/$endpoint';
    final fullUrl = '$cleanBaseUrl$cleanEndpoint';

    final dummyPayload = NotificationPayload(
      sourceApp: 'com.pedagangpulsa.notifforwader',
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
            : 'Server returned error status ${res.statusCode}: ${res.body}',
      };
    } catch (e) {
      return {
        'success': false,
        'message': 'Connection failed: ${e.toString()}',
      };
    }
  }

  static Future<Map<String, dynamic>> testTelegramConnection(String botToken, String chatId) async {
    if (botToken.isEmpty || chatId.isEmpty) {
      return {'success': false, 'message': 'Bot Token and Chat ID cannot be empty'};
    }
    try {
      final res = await http.post(
        Uri.parse('https://api.telegram.org/bot$botToken/sendMessage'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'chat_id': chatId,
          'text': '🔔 *Test Connection*\nSuccessful connection test from Notification Forwarder app!',
          'parse_mode': 'Markdown',
        }),
      ).timeout(const Duration(seconds: 10));

      final isOk = res.statusCode >= 200 && res.statusCode < 300;
      String errorMsg = 'Telegram API error status ${res.statusCode}';
      if (!isOk) {
        try {
          final data = jsonDecode(res.body);
          if (data is Map && data.containsKey('description')) {
            errorMsg += ': ${data['description']}';
          } else {
            errorMsg += ': ${res.body}';
          }
        } catch (_) {
          errorMsg += ': ${res.body}';
        }
      }
      return {
        'success': isOk,
        'statusCode': res.statusCode,
        'message': isOk ? 'Success (Status ${res.statusCode})' : errorMsg,
      };
    } catch (e) {
      return {'success': false, 'message': 'Connection failed: ${e.toString()}'};
    }
  }

  static Future<Map<String, dynamic>> testWhatsappConnection(
      String phoneNumberId, String accessToken, String recipientPhone) async {
    if (phoneNumberId.isEmpty || accessToken.isEmpty || recipientPhone.isEmpty) {
      return {'success': false, 'message': 'Phone Number ID, Access Token, and Recipient Phone cannot be empty'};
    }
    try {
      final res = await http.post(
        Uri.parse('https://graph.facebook.com/v19.0/$phoneNumberId/messages'),
        headers: {
          'Authorization': 'Bearer $accessToken',
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'messaging_product': 'whatsapp',
          'recipient_type': 'individual',
          'to': recipientPhone,
          'type': 'text',
          'text': {
            'preview_url': false,
            'body': '🔔 *Test Connection*\nSuccessful connection test from Notification Forwarder app!',
          },
        }),
      ).timeout(const Duration(seconds: 10));

      final isOk = res.statusCode >= 200 && res.statusCode < 300;
      String errorMsg = 'WhatsApp API error status ${res.statusCode}';
      if (!isOk) {
        try {
          final data = jsonDecode(res.body);
          if (data is Map &&
              data.containsKey('error') &&
              data['error'] is Map &&
              data['error'].containsKey('message')) {
            errorMsg += ': ${data['error']['message']}';
          } else {
            errorMsg += ': ${res.body}';
          }
        } catch (_) {
          errorMsg += ': ${res.body}';
        }
      }
      return {
        'success': isOk,
        'statusCode': res.statusCode,
        'message': isOk ? 'Success (Status ${res.statusCode})' : errorMsg,
      };
    } catch (e) {
      return {'success': false, 'message': 'Connection failed: ${e.toString()}'};
    }
  }
}

class ForwardResult {
  final bool success;
  final String url;
  final String response;

  ForwardResult({
    required this.success,
    required this.url,
    required this.response,
  });
}
