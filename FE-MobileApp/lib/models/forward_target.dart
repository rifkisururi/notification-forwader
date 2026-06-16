enum ForwardTargetType { api, telegram, whatsapp }

class ForwardTarget {
  final String id;
  String name;
  ForwardTargetType type;
  bool isEnabled;
  Map<String, String> config; // Stores configuration depending on type

  ForwardTarget({
    required this.id,
    required this.name,
    required this.type,
    this.isEnabled = true,
    required this.config,
  });

  factory ForwardTarget.fromJson(Map<String, dynamic> json) {
    return ForwardTarget(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      type: ForwardTargetType.values.firstWhere(
        (e) => e.toString().split('.').last == json['type'],
        orElse: () => ForwardTargetType.api,
      ),
      isEnabled: json['isEnabled'] ?? true,
      config: Map<String, String>.from(json['config'] ?? {}),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'type': type.toString().split('.').last,
      'isEnabled': isEnabled,
      'config': config,
    };
  }
}
