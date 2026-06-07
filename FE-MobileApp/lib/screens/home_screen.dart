import 'dart:async';
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:installed_apps/installed_apps.dart';
import '../models/notification_payload.dart';
import '../services/api_service.dart';
import '../services/notification_service.dart';
import '../utils/preferences.dart';
import 'app_selector_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> with WidgetsBindingObserver {
  bool _hasPermission = false;
  List<NotificationLogEntry> _logs = [];
  final Map<String, Uint8List?> _appIconCache = {};

  // Controller states for the settings drawer
  final TextEditingController _urlController = TextEditingController();
  final TextEditingController _endpointController = TextEditingController();
  final TextEditingController _tokenController = TextEditingController();
  final TextEditingController _maxRetriesController = TextEditingController();
  final TextEditingController _retryDelayController = TextEditingController();
  final TextEditingController _deviceNameController = TextEditingController();

  bool _isTestingConnection = false;
  String _testMessage = '';
  bool? _testSuccess;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    
    // Load controllers from saved preferences
    _urlController.text = Preferences.apiBaseUrl;
    _endpointController.text = Preferences.apiEndpoint;
    _tokenController.text = Preferences.apiToken;
    _maxRetriesController.text = Preferences.maxRetries.toString();
    _retryDelayController.text = Preferences.retryDelay.toString();
    _deviceNameController.text = Preferences.deviceName;

    _logs = Preferences.notificationLogs;

    _checkPermissionState();
    NotificationService.addListener(_onNotificationsChanged);
    
    // Periodically update UI to keep timestamps fresh
    Timer.periodic(const Duration(minutes: 1), (timer) {
      if (mounted) {
        setState(() {});
      } else {
        timer.cancel();
      }
    });
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    NotificationService.removeListener(_onNotificationsChanged);
    _urlController.dispose();
    _endpointController.dispose();
    _tokenController.dispose();
    _maxRetriesController.dispose();
    _retryDelayController.dispose();
    _deviceNameController.dispose();
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    // Recheck permission when returning to the app (e.g. from settings screen)
    if (state == AppLifecycleState.resumed) {
      _checkPermissionState();
    }
  }

  void _onNotificationsChanged() {
    if (mounted) {
      setState(() {
        _logs = Preferences.notificationLogs;
      });
    }
  }

  Future<void> _checkPermissionState() async {
    final granted = await NotificationService.checkPermission();
    if (mounted) {
      setState(() {
        _hasPermission = granted;
      });
    }
  }

  Future<void> _loadAppIcon(String packageName) async {
    if (_appIconCache.containsKey(packageName)) return;
    
    // Insert temporary key to avoid duplicate loading attempts
    _appIconCache[packageName] = null;
    
    try {
      final appInfo = await InstalledApps.getAppInfo(packageName);
      if (mounted && appInfo != null) {
        setState(() {
          _appIconCache[packageName] = appInfo.icon;
        });
      }
    } catch (_) {
      // Keep it null
    }
  }

  Future<void> _testApiConnection() async {
    setState(() {
      _isTestingConnection = true;
      _testMessage = 'Connecting...';
      _testSuccess = null;
    });

    final res = await ApiService.testConnection(
      _urlController.text,
      _endpointController.text,
      _tokenController.text,
    );

    if (mounted) {
      setState(() {
        _isTestingConnection = false;
        _testSuccess = res['success'];
        _testMessage = res['message'];
      });
    }
  }

  Future<void> _saveSettings() async {
    await Preferences.setApiBaseUrl(_urlController.text);
    await Preferences.setApiEndpoint(_endpointController.text);
    await Preferences.setApiToken(_tokenController.text);
    await Preferences.setDeviceName(_deviceNameController.text);
    
    final maxRet = int.tryParse(_maxRetriesController.text) ?? 3;
    final delayRet = int.tryParse(_retryDelayController.text) ?? 5;
    await Preferences.setMaxRetries(maxRet);
    await Preferences.setRetryDelay(delayRet);
    
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Settings saved successfully!'),
          backgroundColor: Color(0xFF10B981),
          behavior: SnackBarBehavior.floating,
        ),
      );
      Navigator.pop(context); // Close Drawer
    }
  }

  Future<void> _clearLogs() async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF1E2130),
        title: const Text('Clear Log History', style: TextStyle(color: Colors.white)),
        content: const Text(
          'Are you sure you want to clear all notification logs? This action cannot be undone.',
          style: TextStyle(color: Colors.white70),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Cancel', style: TextStyle(color: Colors.white54)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: Colors.redAccent),
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('Clear', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );

    if (confirm == true) {
      await Preferences.clearNotificationLogs();
      setState(() {
        _logs = [];
      });
    }
  }

  String _formatTime(String receivedAt) {
    try {
      final date = DateTime.parse(receivedAt).toLocal();
      final difference = DateTime.now().difference(date);

      if (difference.inSeconds < 60) {
        return 'Just now';
      } else if (difference.inMinutes < 60) {
        return '${difference.inMinutes}m ago';
      } else if (difference.inHours < 24) {
        return '${difference.inHours}h ago';
      } else {
        return '${date.day}/${date.month} ${date.hour.toString().padLeft(2, '0')}:${date.minute.toString().padLeft(2, '0')}';
      }
    } catch (_) {
      return receivedAt;
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
        title: const Text(
          'Notif Forwarder',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
            fontSize: 20,
          ),
        ),
        iconTheme: const IconThemeData(color: Colors.white),
        actions: [
          IconButton(
            icon: const Icon(Icons.apps, color: Colors.indigoAccent),
            tooltip: 'App Selector',
            onPressed: () async {
              final updated = await Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const AppSelectorScreen()),
              );
              if (updated == true) {
                // Refresh list if needed
              }
            },
          ),
        ],
      ),
      drawer: _buildSettingsDrawer(cardBg, darkBg),
      body: Column(
        children: [
          _buildPermissionBanner(),
          _buildConfigurationSummary(cardBg),
          const Padding(
            padding: EdgeInsets.fromLTRB(16, 12, 16, 4),
            child: Align(
              alignment: Alignment.centerLeft,
              child: Text(
                'NOTIFICATION LOGS',
                style: TextStyle(
                  color: Colors.white54,
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.5,
                ),
              ),
            ),
          ),
          Expanded(
            child: _logs.isEmpty
                ? _buildEmptyState()
                : ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    itemCount: _logs.length,
                    itemBuilder: (context, index) {
                      final entry = _logs[index];
                      // Trigger icon loading
                      _loadAppIcon(entry.payload.sourceApp);
                      return _buildNotificationCard(entry, cardBg);
                    },
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildPermissionBanner() {
    if (_hasPermission) {
      return Container(
        width: double.infinity,
        color: const Color(0xFF10B981).withOpacity(0.15),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        child: const Row(
          children: [
            Icon(Icons.check_circle, color: Color(0xFF10B981), size: 20),
            SizedBox(width: 10),
            Text(
              'Notification Access: Enabled & Active',
              style: TextStyle(color: Color(0xFF10B981), fontWeight: FontWeight.bold, fontSize: 13),
            ),
          ],
        ),
      );
    }

    return GestureDetector(
      onTap: () => NotificationService.openPermissionSettings(),
      child: Container(
        width: double.infinity,
        color: const Color(0xFFF59E0B).withOpacity(0.15),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        child: Row(
          children: [
            const Icon(Icons.warning_amber_rounded, color: Color(0xFFF59E0B), size: 22),
            const SizedBox(width: 10),
            const Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Permission Required',
                    style: TextStyle(color: Color(0xFFF59E0B), fontWeight: FontWeight.bold, fontSize: 13),
                  ),
                  Text(
                    'Tap to grant Notification Listener Access.',
                    style: TextStyle(color: Colors.white70, fontSize: 12),
                  ),
                ],
              ),
            ),
            Icon(Icons.chevron_right, color: const Color(0xFFF59E0B).withOpacity(0.7)),
          ],
        ),
      ),
    );
  }

  Widget _buildConfigurationSummary(Color cardBg) {
    final baseUrl = Preferences.apiBaseUrl;
    final hasUrl = baseUrl.isNotEmpty;

    return Container(
      margin: const EdgeInsets.fromLTRB(16, 12, 16, 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: cardBg,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withOpacity(0.05)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: hasUrl ? const Color(0xFF6366F1).withOpacity(0.15) : Colors.redAccent.withOpacity(0.15),
              shape: BoxShape.circle,
            ),
            child: Icon(
              hasUrl ? Icons.link : Icons.link_off,
              color: hasUrl ? const Color(0xFF6366F1) : Colors.redAccent,
              size: 20,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'API Forwarding Address',
                  style: TextStyle(color: Colors.white70, fontSize: 11, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 2),
                Text(
                  hasUrl ? '$baseUrl${Preferences.apiEndpoint}' : 'Configure REST API in drawer settings',
                  style: TextStyle(
                    color: hasUrl ? Colors.white : Colors.white54,
                    fontSize: 13,
                    fontWeight: FontWeight.bold,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          OutlinedButton(
            style: OutlinedButton.styleFrom(
              foregroundColor: Colors.indigoAccent,
              side: BorderSide(color: Colors.indigoAccent.withOpacity(0.3)),
              padding: const EdgeInsets.symmetric(horizontal: 12),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Swipe from left edge or tap the menu to configure.'),
                  behavior: SnackBarBehavior.floating,
                ),
              );
            },
            child: const Text('Setup', style: TextStyle(fontSize: 12)),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.inbox_outlined, color: Colors.white.withOpacity(0.2), size: 70),
          const SizedBox(height: 16),
          Text(
            'No notifications captured yet',
            style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 16, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 40.0),
            child: Text(
              'Make sure permission is granted and you have selected apps to monitor using the grid icon in the top right.',
              style: TextStyle(color: Colors.white.withOpacity(0.4), fontSize: 12),
              textAlign: TextAlign.center,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildNotificationCard(NotificationLogEntry entry, Color cardBg) {
    final payload = entry.payload;
    final cachedIcon = _appIconCache[payload.sourceApp];
    
    // Status Badge colors & icon
    Color badgeColor;
    Widget statusWidget;
    switch (entry.status) {
      case NotificationStatus.sending:
        badgeColor = const Color(0xFFF59E0B);
        statusWidget = const SizedBox(
          width: 12,
          height: 12,
          child: CircularProgressIndicator(
            strokeWidth: 2,
            valueColor: AlwaysStoppedAnimation<Color>(Color(0xFFF59E0B)),
          ),
        );
        break;
      case NotificationStatus.sent:
        badgeColor = const Color(0xFF10B981);
        statusWidget = const Icon(Icons.check, color: Color(0xFF10B981), size: 12);
        break;
      case NotificationStatus.failed:
        badgeColor = const Color(0xFFEF4444);
        statusWidget = const Icon(Icons.close, color: Color(0xFFEF4444), size: 12);
        break;
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: cardBg,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withOpacity(0.04)),
      ),
      child: ExpansionTile(
        tilePadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        iconColor: Colors.white54,
        collapsedIconColor: Colors.white30,
        leading: ClipRRect(
          borderRadius: BorderRadius.circular(10),
          child: cachedIcon != null
              ? Image.memory(
                  cachedIcon,
                  width: 42,
                  height: 42,
                  fit: BoxFit.cover,
                )
              : Container(
                  width: 42,
                  height: 42,
                  color: Colors.indigo.shade800,
                  alignment: Alignment.center,
                  child: Text(
                    payload.sourceAppLabel.isNotEmpty ? payload.sourceAppLabel.substring(0, 1).toUpperCase() : '?',
                    style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 18),
                  ),
                ),
        ),
        title: Row(
          children: [
            Expanded(
              child: Text(
                payload.sourceAppLabel.isNotEmpty ? payload.sourceAppLabel : payload.sourceApp,
                style: const TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.bold),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ),
            const SizedBox(width: 6),
            Text(
              _formatTime(payload.receivedAt),
              style: TextStyle(color: Colors.white.withOpacity(0.4), fontSize: 11),
            ),
          ],
        ),
        subtitle: Padding(
          padding: const EdgeInsets.only(top: 4.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                payload.title,
                style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 2),
              Text(
                payload.text,
                style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 13),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 6),
              Row(
                children: [
                  // Nominal Badge
                  if (entry.nominal != null)
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      margin: const EdgeInsets.only(right: 8),
                      decoration: BoxDecoration(
                        color: const Color(0xFF06B6D4).withOpacity(0.15),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        entry.nominal!,
                        style: const TextStyle(
                          color: Color(0xFF06B6D4),
                          fontWeight: FontWeight.bold,
                          fontSize: 11,
                        ),
                      ),
                    ),
                  
                  // Status Badge
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: badgeColor.withOpacity(0.15),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        statusWidget,
                        const SizedBox(width: 4),
                        Text(
                          entry.status.name.toUpperCase(),
                          style: TextStyle(
                            color: badgeColor,
                            fontWeight: FontWeight.bold,
                            fontSize: 9,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
            child: Align(
              alignment: Alignment.centerLeft,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Divider(color: Colors.white10),
                  const SizedBox(height: 6),
                  _buildDetailRow('Package', payload.sourceApp),
                  _buildDetailRow('Notification ID', payload.notifId.toString()),
                  _buildDetailRow('Received UTC', payload.receivedAt),
                  if (payload.bigText.isNotEmpty)
                    _buildDetailRow('Big Text', payload.bigText),
                  if (entry.status == NotificationStatus.failed)
                    Padding(
                      padding: const EdgeInsets.only(top: 8.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              const Icon(Icons.error_outline, color: Colors.redAccent, size: 14),
                              const SizedBox(width: 4),
                              Expanded(
                                child: Text(
                                  entry.error ?? 'Forwarding failed. Ensure network connects and API credentials are correct.',
                                  style: TextStyle(color: Colors.red.shade300, fontSize: 11, fontStyle: FontStyle.italic),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          ElevatedButton.icon(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFFEF4444).withOpacity(0.15),
                              foregroundColor: Colors.redAccent,
                              elevation: 0,
                              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(8),
                                side: BorderSide(color: Colors.redAccent.withOpacity(0.2)),
                              ),
                            ),
                            onPressed: () {
                              NotificationService.retryForward(entry);
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text('Retrying notification forwarding...'),
                                  behavior: SnackBarBehavior.floating,
                                  duration: Duration(seconds: 2),
                                ),
                              );
                            },
                            icon: const Icon(Icons.refresh, size: 14),
                            label: const Text('Retry Sending', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                          ),
                        ],
                      ),
                    ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(color: Colors.white38, fontSize: 10, fontWeight: FontWeight.bold)),
          const SizedBox(height: 2),
          SelectableText(value, style: const TextStyle(color: Colors.white70, fontSize: 12)),
        ],
      ),
    );
  }

  Widget _buildSettingsDrawer(Color drawerColor, Color mainBg) {
    return Drawer(
      backgroundColor: drawerColor,
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'API Settings',
                style: TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 22,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                'Configure your REST endpoint to forward incoming notifications.',
                style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 12),
              ),
              const SizedBox(height: 20),
              
              // Device Name Input
              _buildTextInput(
                controller: _deviceNameController,
                label: 'Device Name',
                hint: 'e.g. HP Kasir 1',
                icon: Icons.phone_android,
              ),
              const SizedBox(height: 16),
              
              // Base URL Input
              _buildTextInput(
                controller: _urlController,
                label: 'API Base URL',
                hint: 'https://api.yourdomain.com',
                icon: Icons.dns,
              ),
              const SizedBox(height: 16),
              
              // Endpoint Input
              _buildTextInput(
                controller: _endpointController,
                label: 'Endpoint',
                hint: '/api/notification',
                icon: Icons.route,
              ),
              const SizedBox(height: 16),
              
              // Bearer Token Input
              _buildTextInput(
                controller: _tokenController,
                label: 'Bearer Token (Optional)',
                hint: 'your-bearer-token',
                icon: Icons.vpn_key,
                isPassword: true,
              ),
              const SizedBox(height: 16),

              Row(
                children: [
                  Expanded(
                    child: _buildTextInput(
                      controller: _maxRetriesController,
                      label: 'Max Retries',
                      hint: '3',
                      icon: Icons.repeat,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildTextInput(
                      controller: _retryDelayController,
                      label: 'Delay (seconds)',
                      hint: '5',
                      icon: Icons.timer_outlined,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),

              // Test Connection Status Message
              if (_testMessage.isNotEmpty)
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                  margin: const EdgeInsets.only(bottom: 16),
                  decoration: BoxDecoration(
                    color: _testSuccess == true
                        ? const Color(0xFF10B981).withOpacity(0.15)
                        : _testSuccess == false
                            ? Colors.redAccent.withOpacity(0.15)
                            : Colors.grey.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Row(
                    children: [
                      Icon(
                        _testSuccess == true
                            ? Icons.check_circle_outline
                            : _testSuccess == false
                                ? Icons.error_outline
                                : Icons.hourglass_empty,
                        color: _testSuccess == true
                            ? const Color(0xFF10B981)
                            : _testSuccess == false
                                ? Colors.redAccent
                                : Colors.grey,
                        size: 16,
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          _testMessage,
                          style: TextStyle(
                            color: _testSuccess == true
                                ? const Color(0xFF10B981)
                                : _testSuccess == false
                                    ? Colors.redAccent
                                    : Colors.white,
                            fontSize: 11,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),

              // Action buttons
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      style: OutlinedButton.styleFrom(
                        foregroundColor: Colors.white,
                        side: BorderSide(color: Colors.white.withOpacity(0.2)),
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      onPressed: _isTestingConnection ? null : _testApiConnection,
                      child: _isTestingConnection
                          ? const SizedBox(
                              width: 16,
                              height: 16,
                              child: CircularProgressIndicator(strokeWidth: 2, valueColor: AlwaysStoppedAnimation(Colors.white)),
                            )
                          : const Text('Test Connection', style: TextStyle(fontSize: 13)),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF6366F1),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      onPressed: _saveSettings,
                      child: const Text('Save Settings', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                    ),
                  ),
                ],
              ),
              const Spacer(),
              const Divider(color: Colors.white10),
              const SizedBox(height: 10),
              
              // Clear Logs Button
              ListTile(
                contentPadding: EdgeInsets.zero,
                leading: const Icon(Icons.delete_sweep, color: Colors.redAccent),
                title: const Text('Clear Logs History', style: TextStyle(color: Colors.redAccent, fontSize: 14)),
                onTap: _clearLogs,
              ),

              // Battery Optimization Tips Link
              ListTile(
                contentPadding: EdgeInsets.zero,
                leading: const Icon(Icons.battery_alert, color: Colors.amber),
                title: const Text('Android Background Help', style: TextStyle(color: Colors.amber, fontSize: 14)),
                subtitle: const Text('Prevent app being closed by OS', style: TextStyle(color: Colors.white30, fontSize: 11)),
                onTap: () {
                  showDialog(
                    context: context,
                    builder: (ctx) => AlertDialog(
                      backgroundColor: const Color(0xFF1E2130),
                      title: const Text('Background Execution Settings', style: TextStyle(color: Colors.white)),
                      content: const SingleChildScrollView(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              'Android might automatically suspend or kill this app to optimize battery life.',
                              style: TextStyle(color: Colors.white70),
                            ),
                            SizedBox(height: 10),
                            Text(
                              'To guarantee 24/7 background execution:',
                              style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                            ),
                            SizedBox(height: 8),
                            Text(
                              '1. Open device system Settings.\n'
                              '2. Go to Apps -> "Notif Forwarder" -> Battery.\n'
                              '3. Set battery optimization settings to "Unrestricted" or disable optimizations.',
                              style: TextStyle(color: Colors.white70),
                            ),
                          ],
                        ),
                      ),
                      actions: [
                        TextButton(
                          onPressed: () => Navigator.pop(ctx),
                          child: const Text('Got it', style: TextStyle(color: Colors.indigoAccent)),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTextInput({
    required TextEditingController controller,
    required String label,
    required String hint,
    required IconData icon,
    bool isPassword = false,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 6),
        TextField(
          controller: controller,
          obscureText: isPassword,
          style: const TextStyle(color: Colors.white),
          decoration: InputDecoration(
            hintText: hint,
            hintStyle: TextStyle(color: Colors.white.withOpacity(0.3)),
            prefixIcon: Icon(icon, color: Colors.white54, size: 18),
            filled: true,
            fillColor: const Color(0xFF12141C),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12.0),
              borderSide: BorderSide.none,
            ),
            contentPadding: const EdgeInsets.symmetric(vertical: 12.0),
          ),
        ),
      ],
    );
  }
}
