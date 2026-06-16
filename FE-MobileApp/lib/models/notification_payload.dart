class NotificationPayload {
  final String sourceApp;
  final String sourceAppLabel;
  final String title;
  final String text;
  final String bigText;
  final String receivedAt;
  final int notifId;
  final String? deviceName;

  NotificationPayload({
    required this.sourceApp,
    required this.sourceAppLabel,
    required this.title,
    required this.text,
    required this.bigText,
    required this.receivedAt,
    required this.notifId,
    this.deviceName,
  });

  factory NotificationPayload.fromJson(Map<String, dynamic> json) {
    return NotificationPayload(
      sourceApp: json['source_app'] ?? '',
      sourceAppLabel: json['source_app_label'] ?? '',
      title: json['title'] ?? '',
      text: json['text'] ?? '',
      bigText: json['big_text'] ?? '',
      receivedAt: json['received_at'] ?? '',
      notifId: json['notif_id'] ?? 0,
      deviceName: json['device_name'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'source_app': sourceApp,
      'source_app_label': sourceAppLabel,
      'title': title,
      'text': text,
      'big_text': bigText,
      'received_at': receivedAt,
      'notif_id': notifId,
      if (deviceName != null) 'device_name': deviceName,
    };
  }
}

enum NotificationStatus { sending, sent, failed }

class NotificationLogEntry {
  final String id; // Unique internal ID for deduplication and local identification
  final NotificationPayload payload;
  NotificationStatus status;
  final String? nominal;
  String? error;
  Map<String, String> targetStatuses; // targetId -> 'sending'/'sent'/'failed'
  Map<String, String> targetErrors;   // targetId -> errorMessage

  NotificationLogEntry({
    required this.id,
    required this.payload,
    required this.status,
    this.nominal,
    this.error,
    this.targetStatuses = const {},
    this.targetErrors = const {},
  });

  // Extract nominal from text/bigText (e.g. Rp150.000, Rp 150.000, Rp. 150.000)
  static String? parseNominal(String text, String bigText) {
    final searchSource = bigText.isNotEmpty ? bigText : text;
    // Regex matches Rp, Rp., IDR followed by numbers with dots or commas as thousand/decimal separators
    final regExp = RegExp(r'(?:Rp\.?|IDR)\s*(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?)', caseSensitive: false);
    final match = regExp.firstMatch(searchSource);
    if (match != null) {
      return match.group(0); // Returns the whole matched string e.g. "Rp150.000"
    }
    return null;
  }

  factory NotificationLogEntry.fromJson(Map<String, dynamic> json) {
    return NotificationLogEntry(
      id: json['id'] ?? '',
      payload: NotificationPayload.fromJson(json['payload']),
      status: NotificationStatus.values.firstWhere(
        (e) => e.toString() == json['status'],
        orElse: () => NotificationStatus.failed,
      ),
      nominal: json['nominal'],
      error: json['error'],
      targetStatuses: Map<String, String>.from(json['targetStatuses'] ?? {}),
      targetErrors: Map<String, String>.from(json['targetErrors'] ?? {}),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'payload': payload.toJson(),
      'status': status.toString(),
      'nominal': nominal,
      'error': error,
      'targetStatuses': targetStatuses,
      'targetErrors': targetErrors,
    };
  }
}
