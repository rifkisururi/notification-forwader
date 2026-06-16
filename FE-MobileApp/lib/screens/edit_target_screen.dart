import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../models/forward_target.dart';
import '../services/api_service.dart';
import '../utils/preferences.dart';

class EditTargetScreen extends StatefulWidget {
  final ForwardTarget? target;

  const EditTargetScreen({super.key, this.target});

  @override
  State<EditTargetScreen> createState() => _EditTargetScreenState();
}

class _EditTargetScreenState extends State<EditTargetScreen> {
  final _formKey = GlobalKey<FormState>();
  
  late String _id;
  late TextEditingController _nameController;
  late ForwardTargetType _selectedType;
  
  // API fields
  late TextEditingController _apiUrlController;
  late TextEditingController _apiEndpointController;
  late TextEditingController _apiTokenController;
  
  // Telegram fields
  late TextEditingController _tgBotTokenController;
  late TextEditingController _tgChatIdController;
  
  // WhatsApp fields
  late TextEditingController _waPhoneIdController;
  late TextEditingController _waTokenController;
  late TextEditingController _waRecipientController;
  
  // Common Template field
  late TextEditingController _templateController;

  bool _isTesting = false;
  String _testMessage = '';
  bool? _testSuccess;

  @override
  void initState() {
    super.initState();
    final t = widget.target;
    _id = t?.id ?? DateTime.now().millisecondsSinceEpoch.toString();
    _nameController = TextEditingController(text: t?.name ?? '');
    _selectedType = t?.type ?? ForwardTargetType.api;

    // API
    _apiUrlController = TextEditingController(text: t?.type == ForwardTargetType.api ? t?.config['baseUrl'] ?? '' : '');
    _apiEndpointController = TextEditingController(text: t?.type == ForwardTargetType.api ? t?.config['endpoint'] ?? '/api/notification' : '/api/notification');
    _apiTokenController = TextEditingController(text: t?.type == ForwardTargetType.api ? t?.config['token'] ?? '' : '');

    // Telegram
    _tgBotTokenController = TextEditingController(text: t?.type == ForwardTargetType.telegram ? t?.config['botToken'] ?? '' : '');
    _tgChatIdController = TextEditingController(text: t?.type == ForwardTargetType.telegram ? t?.config['chatId'] ?? '' : '');

    // WhatsApp
    _waPhoneIdController = TextEditingController(text: t?.type == ForwardTargetType.whatsapp ? t?.config['phoneNumberId'] ?? '' : '');
    _waTokenController = TextEditingController(text: t?.type == ForwardTargetType.whatsapp ? t?.config['accessToken'] ?? '' : '');
    _waRecipientController = TextEditingController(text: t?.type == ForwardTargetType.whatsapp ? t?.config['recipientPhone'] ?? '' : '');

    // Custom template
    _templateController = TextEditingController(text: t?.config['customTemplate'] ?? '');
  }

  @override
  void dispose() {
    _nameController.dispose();
    _apiUrlController.dispose();
    _apiEndpointController.dispose();
    _apiTokenController.dispose();
    _tgBotTokenController.dispose();
    _tgChatIdController.dispose();
    _waPhoneIdController.dispose();
    _waTokenController.dispose();
    _waRecipientController.dispose();
    _templateController.dispose();
    super.dispose();
  }

  Future<void> _testConnection() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isTesting = true;
      _testMessage = 'Testing connection...';
      _testSuccess = null;
    });

    Map<String, dynamic> result;
    switch (_selectedType) {
      case ForwardTargetType.api:
        result = await ApiService.testConnection(
          _apiUrlController.text,
          _apiEndpointController.text,
          _apiTokenController.text,
        );
        break;
      case ForwardTargetType.telegram:
        result = await ApiService.testTelegramConnection(
          _tgBotTokenController.text,
          _tgChatIdController.text,
        );
        break;
      case ForwardTargetType.whatsapp:
        result = await ApiService.testWhatsappConnection(
          _waPhoneIdController.text,
          _waTokenController.text,
          _waRecipientController.text,
        );
        break;
    }

    if (mounted) {
      setState(() {
        _isTesting = false;
        _testSuccess = result['success'];
        _testMessage = result['message'];
      });
    }
  }

  void _saveTarget() {
    if (!_formKey.currentState!.validate()) return;

    final name = _nameController.text.trim().isNotEmpty 
        ? _nameController.text.trim()
        : _getDefaultName();

    Map<String, String> config = {};
    switch (_selectedType) {
      case ForwardTargetType.api:
        config = {
          'baseUrl': _apiUrlController.text.trim(),
          'endpoint': _apiEndpointController.text.trim(),
          'token': _apiTokenController.text.trim(),
        };
        break;
      case ForwardTargetType.telegram:
        config = {
          'botToken': _tgBotTokenController.text.trim(),
          'chatId': _tgChatIdController.text.trim(),
          'customTemplate': _templateController.text.trim(),
        };
        break;
      case ForwardTargetType.whatsapp:
        config = {
          'phoneNumberId': _waPhoneIdController.text.trim(),
          'accessToken': _waTokenController.text.trim(),
          'recipientPhone': _waRecipientController.text.trim(),
          'customTemplate': _templateController.text.trim(),
        };
        break;
    }

    final newTarget = ForwardTarget(
      id: _id,
      name: name,
      type: _selectedType,
      isEnabled: widget.target?.isEnabled ?? true,
      config: config,
    );

    final targets = Preferences.forwardTargets;
    final index = targets.indexWhere((t) => t.id == _id);

    if (index != -1) {
      targets[index] = newTarget;
    } else {
      targets.add(newTarget);
    }

    Preferences.saveForwardTargets(targets);
    
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Forward target saved!'),
        backgroundColor: Color(0xFF10B981),
        behavior: SnackBarBehavior.floating,
      ),
    );
    Navigator.pop(context, true);
  }

  void _insertPlaceholder(String tag) {
    final text = _templateController.text;
    final selection = _templateController.selection;

    String newText;
    int newCursorPos;

    if (selection.isValid && selection.start >= 0) {
      final start = selection.start;
      final end = selection.end;
      newText = text.replaceRange(start, end, tag);
      newCursorPos = start + tag.length;
    } else {
      newText = text + tag;
      newCursorPos = newText.length;
    }

    setState(() {
      _templateController.text = newText;
      _templateController.selection = TextSelection.collapsed(offset: newCursorPos);
    });
  }

  String _getDefaultName() {
    switch (_selectedType) {
      case ForwardTargetType.api:
        return 'REST API';
      case ForwardTargetType.telegram:
        return 'Telegram Channel';
      case ForwardTargetType.whatsapp:
        return 'WhatsApp Business';
    }
  }

  @override
  Widget build(BuildContext context) {
    final darkBg = const Color(0xFF12141C);
    final cardBg = const Color(0xFF1E2130);

    return Scaffold(
      backgroundColor: darkBg,
      appBar: AppBar(
        backgroundColor: darkBg,
        elevation: 0,
        title: Text(
          widget.target == null ? 'Add Forward Target' : 'Edit Forward Target',
          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16.0),
          children: [
            // Target Name
            _buildTextInput(
              controller: _nameController,
              label: 'Target Name',
              hint: 'e.g. My Telegram Group / Client Webhook',
              icon: Icons.label_outline,
            ),
            const SizedBox(height: 20),

            // Target Type Selector (Toggles)
            const Text(
              'Forwarding Channel Type',
              style: TextStyle(color: Colors.white70, fontSize: 13, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            _buildTypeSelector(cardBg),
            const SizedBox(height: 24),

            const Divider(color: Colors.white10),
            const SizedBox(height: 16),

            // Dynamic Form Fields based on Type
            if (_selectedType == ForwardTargetType.api) ..._buildApiFields(),
            if (_selectedType == ForwardTargetType.telegram) ..._buildTelegramFields(),
            if (_selectedType == ForwardTargetType.whatsapp) ..._buildWhatsappFields(),

            // Template Field for Telegram & WhatsApp
            if (_selectedType != ForwardTargetType.api) ...[
              const SizedBox(height: 20),
              DragTarget<String>(
                onWillAcceptWithDetails: (details) => true,
                onAcceptWithDetails: (details) {
                  _insertPlaceholder(details.data);
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('Inserted ${details.data}'),
                      duration: const Duration(seconds: 1),
                      behavior: SnackBarBehavior.floating,
                    ),
                  );
                },
                builder: (context, candidateData, rejectedData) {
                  final isHovered = candidateData.isNotEmpty;
                  return AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: isHovered ? const Color(0xFF6366F1) : Colors.transparent,
                        width: 2,
                      ),
                    ),
                    child: _buildTextInput(
                      controller: _templateController,
                      label: 'Custom Message Template (Optional)',
                      hint: 'Default format will be used if empty',
                      icon: Icons.message_outlined,
                      maxLines: 4,
                    ),
                  );
                },
              ),
              const SizedBox(height: 8),
              _buildTemplateCheatSheet(cardBg),
            ],

            const SizedBox(height: 24),

            // Test Connection Result
            if (_testMessage.isNotEmpty) _buildTestResultWidget(),

            const SizedBox(height: 20),

            // Action Buttons
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    style: OutlinedButton.styleFrom(
                      foregroundColor: Colors.white,
                      side: BorderSide(color: Colors.white.withOpacity(0.2)),
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    onPressed: _isTesting ? null : _testConnection,
                    child: _isTesting
                        ? const SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(strokeWidth: 2, valueColor: AlwaysStoppedAnimation(Colors.white)),
                          )
                        : const Text('Test Connection', style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF6366F1),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    onPressed: _saveTarget,
                    child: const Text('Save Target', style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  Widget _buildTypeSelector(Color cardBg) {
    return Row(
      children: [
        _buildTypeCard(ForwardTargetType.api, 'API POST', Icons.api, const Color(0xFF6366F1), cardBg),
        const SizedBox(width: 8),
        _buildTypeCard(ForwardTargetType.telegram, 'Telegram', Icons.send, const Color(0xFF0088CC), cardBg),
        const SizedBox(width: 8),
        _buildTypeCard(ForwardTargetType.whatsapp, 'WhatsApp', Icons.chat, const Color(0xFF25D366), cardBg),
      ],
    );
  }

  Widget _buildTypeCard(ForwardTargetType type, String label, IconData icon, Color color, Color cardBg) {
    final isSelected = _selectedType == type;
    return Expanded(
      child: GestureDetector(
        onTap: () {
          setState(() {
            _selectedType = type;
            _testMessage = '';
            _testSuccess = null;
          });
        },
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 8),
          decoration: BoxDecoration(
            color: isSelected ? color.withOpacity(0.15) : cardBg,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: isSelected ? color : Colors.white.withOpacity(0.05),
              width: 1.5,
            ),
          ),
          child: Column(
            children: [
              Icon(icon, color: isSelected ? color : Colors.white54, size: 24),
              const SizedBox(height: 8),
              Text(
                label,
                style: TextStyle(
                  color: isSelected ? Colors.white : Colors.white70,
                  fontSize: 12,
                  fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  List<Widget> _buildApiFields() {
    final cardBg = const Color(0xFF1E2130);
    return [
      _buildTextInput(
        controller: _apiUrlController,
        label: 'API Base URL',
        hint: 'https://api.yourdomain.com',
        icon: Icons.dns,
        validator: (val) => val == null || val.isEmpty ? 'API Base URL is required' : null,
      ),
      const SizedBox(height: 16),
      _buildTextInput(
        controller: _apiEndpointController,
        label: 'Endpoint',
        hint: '/api/notification',
        icon: Icons.route,
        validator: (val) => val == null || val.isEmpty ? 'Endpoint is required' : null,
      ),
      const SizedBox(height: 16),
      _buildTextInput(
        controller: _apiTokenController,
        label: 'Bearer Token (Optional)',
        hint: 'your-bearer-token',
        icon: Icons.vpn_key,
        isPassword: true,
      ),
      _buildJsonPreview(cardBg),
    ];
  }

  List<Widget> _buildTelegramFields() {
    return [
      _buildTextInput(
        controller: _tgBotTokenController,
        label: 'Telegram Bot Token',
        hint: '5000000000:AAFnabcdef...',
        icon: Icons.token,
        validator: (val) => val == null || val.isEmpty ? 'Bot Token is required' : null,
      ),
      const SizedBox(height: 16),
      _buildTextInput(
        controller: _tgChatIdController,
        label: 'Chat ID / Channel Username',
        hint: '-1001234567890 or @my_channel',
        icon: Icons.alternate_email,
        validator: (val) => val == null || val.isEmpty ? 'Chat ID is required' : null,
      ),
    ];
  }

  List<Widget> _buildWhatsappFields() {
    return [
      _buildTextInput(
        controller: _waPhoneIdController,
        label: 'WhatsApp Phone Number ID',
        hint: 'e.g. 102938475610293',
        icon: Icons.phone_callback_outlined,
        validator: (val) => val == null || val.isEmpty ? 'Phone Number ID is required' : null,
      ),
      const SizedBox(height: 16),
      _buildTextInput(
        controller: _waTokenController,
        label: 'Meta Access Token (Permanent)',
        hint: 'EAAG...',
        icon: Icons.vpn_key,
        isPassword: true,
        validator: (val) => val == null || val.isEmpty ? 'Meta Access Token is required' : null,
      ),
      const SizedBox(height: 16),
      _buildTextInput(
        controller: _waRecipientController,
        label: 'Recipient Phone Number (with Country Code)',
        hint: 'e.g. 628123456789 (no + or spaces)',
        icon: Icons.phone_enabled,
        validator: (val) {
          if (val == null || val.isEmpty) return 'Recipient Phone Number is required';
          if (val.startsWith('+')) return 'Do not include + sign, just start with country code';
          return null;
        },
      ),
    ];
  }

  Widget _buildTemplateCheatSheet(Color cardBg) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: cardBg,
        borderRadius: BorderRadius.circular(10),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Placeholders (Drag & Drop or Tap to Insert):',
            style: TextStyle(color: Colors.white70, fontSize: 11, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),
          Wrap(
            spacing: 6,
            runSpacing: 6,
            children: [
              _PlaceholderTag(text: '{title}', onTap: () => _insertPlaceholder('{title}')),
              _PlaceholderTag(text: '{text}', onTap: () => _insertPlaceholder('{text}')),
              _PlaceholderTag(text: '{nominal}', onTap: () => _insertPlaceholder('{nominal}')),
              _PlaceholderTag(text: '{source_app_label}', onTap: () => _insertPlaceholder('{source_app_label}')),
              _PlaceholderTag(text: '{received_at}', onTap: () => _insertPlaceholder('{received_at}')),
              _PlaceholderTag(text: '{device_name}', onTap: () => _insertPlaceholder('{device_name}')),
            ],
          )
        ],
      ),
    );
  }

  Widget _buildTestResultWidget() {
    final color = _testSuccess == true
        ? const Color(0xFF10B981)
        : _testSuccess == false
            ? Colors.redAccent
            : Colors.grey;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        color: color.withOpacity(0.12),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Row(
        children: [
          Icon(
            _testSuccess == true
                ? Icons.check_circle
                : _testSuccess == false
                    ? Icons.error_outline
                    : Icons.info_outline,
            color: color,
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              _testMessage,
              style: TextStyle(color: color, fontSize: 13, fontWeight: FontWeight.w500),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTextInput({
    required TextEditingController controller,
    required String label,
    required String hint,
    required IconData icon,
    bool isPassword = false,
    int maxLines = 1,
    String? Function(String?)? validator,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 6),
        TextFormField(
          controller: controller,
          obscureText: isPassword,
          maxLines: maxLines,
          style: const TextStyle(color: Colors.white),
          validator: validator,
          decoration: InputDecoration(
            hintText: hint,
            hintStyle: TextStyle(color: Colors.white.withOpacity(0.3), fontSize: 13),
            prefixIcon: Icon(icon, color: Colors.white54, size: 18),
            filled: true,
            fillColor: const Color(0xFF1E2130),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12.0),
              borderSide: BorderSide.none,
            ),
            contentPadding: const EdgeInsets.symmetric(vertical: 14.0, horizontal: 16),
          ),
        ),
      ],
    );
  }

  Widget _buildJsonPreview(Color cardBg) {
    return Container(
      margin: const EdgeInsets.only(top: 16),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFF12141C),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.white.withOpacity(0.05)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'SAMPLE POST PAYLOAD',
                style: TextStyle(
                  color: Colors.white38,
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.2,
                ),
              ),
              InkWell(
                onTap: () {
                  const rawJson = '{\n'
                      '  "source_app": "id.co.bri.merchant",\n'
                      '  "source_app_label": "BRImerchant",\n'
                      '  "title": "Pembayaran Diterima",\n'
                      '  "text": "QRIS Rp150.000 berhasil",\n'
                      '  "big_text": "Pembayaran QRIS sebesar Rp150.000 berhasil diterima",\n'
                      '  "received_at": "2026-06-06T11:45:00Z",\n'
                      '  "notif_id": 12345,\n'
                      '  "device_name": "HP Kasir 1"\n'
                      '}';
                  Clipboard.setData(const ClipboardData(text: rawJson));
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('JSON copied to clipboard!'),
                      behavior: SnackBarBehavior.floating,
                      duration: Duration(seconds: 1),
                    ),
                  );
                },
                borderRadius: BorderRadius.circular(4),
                child: const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  child: Row(
                    children: [
                      Icon(Icons.copy, color: Colors.indigoAccent, size: 12),
                      SizedBox(width: 4),
                      Text(
                        'Copy',
                        style: TextStyle(color: Colors.indigoAccent, fontSize: 10, fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: RichText(
              text: TextSpan(
                style: const TextStyle(fontFamily: 'monospace', fontSize: 11, height: 1.4),
                children: [
                  const TextSpan(text: '{\n', style: TextStyle(color: Colors.white)),
                  _jsonLine('  ', '"source_app"', ': ', '"id.co.bri.merchant"', ',\n'),
                  _jsonLine('  ', '"source_app_label"', ': ', '"BRImerchant"', ',\n'),
                  _jsonLine('  ', '"title"', ': ', '"Pembayaran Diterima"', ',\n'),
                  _jsonLine('  ', '"text"', ': ', '"QRIS Rp150.000 berhasil"', ',\n'),
                  _jsonLine('  ', '"big_text"', ': ', '"Pembayaran QRIS sebesar Rp150.000 berhasil diterima"', ',\n'),
                  _jsonLine('  ', '"received_at"', ': ', '"2026-06-06T11:45:00Z"', ',\n'),
                  _jsonNumberLine('  ', '"notif_id"', ': ', '12345', ',\n'),
                  _jsonLine('  ', '"device_name"', ': ', '"HP Kasir 1"', '\n'),
                  const TextSpan(text: '}', style: TextStyle(color: Colors.white)),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  TextSpan _jsonLine(String indent, String key, String colon, String val, String end) {
    return TextSpan(children: [
      TextSpan(text: indent),
      TextSpan(text: key, style: const TextStyle(color: Color(0xFFF472B6))),
      TextSpan(text: colon, style: const TextStyle(color: Colors.white70)),
      TextSpan(text: val, style: const TextStyle(color: Color(0xFF34D399))),
      TextSpan(text: end, style: const TextStyle(color: Colors.white70)),
    ]);
  }

  TextSpan _jsonNumberLine(String indent, String key, String colon, String val, String end) {
    return TextSpan(children: [
      TextSpan(text: indent),
      TextSpan(text: key, style: const TextStyle(color: Color(0xFFF472B6))),
      TextSpan(text: colon, style: const TextStyle(color: Colors.white70)),
      TextSpan(text: val, style: const TextStyle(color: Color(0xFF60A5FA))),
      TextSpan(text: end, style: const TextStyle(color: Colors.white70)),
    ]);
  }
}

class _PlaceholderTag extends StatelessWidget {
  final String text;
  final VoidCallback onTap;

  const _PlaceholderTag({required this.text, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final tagWidget = Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.08),
        borderRadius: BorderRadius.circular(6),
        border: Border.all(color: Colors.indigoAccent.withOpacity(0.3)),
      ),
      child: Text(
        text,
        style: const TextStyle(
          color: Colors.indigoAccent,
          fontSize: 11,
          fontFamily: 'monospace',
          fontWeight: FontWeight.bold,
        ),
      ),
    );

    return Draggable<String>(
      data: text,
      feedback: Material(
        color: Colors.transparent,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
          decoration: BoxDecoration(
            color: const Color(0xFF6366F1),
            borderRadius: BorderRadius.circular(8),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.3),
                blurRadius: 6,
                offset: const Offset(0, 3),
              ),
            ],
          ),
          child: Text(
            text,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 11,
              fontFamily: 'monospace',
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
      ),
      childWhenDragging: Opacity(
        opacity: 0.4,
        child: tagWidget,
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(6),
        child: tagWidget,
      ),
    );
  }
}
