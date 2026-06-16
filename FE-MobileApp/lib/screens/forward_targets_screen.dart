import 'package:flutter/material.dart';
import '../models/forward_target.dart';
import '../utils/preferences.dart';
import 'edit_target_screen.dart';

class ForwardTargetsScreen extends StatefulWidget {
  const ForwardTargetsScreen({super.key});

  @override
  State<ForwardTargetsScreen> createState() => _ForwardTargetsScreenState();
}

class _ForwardTargetsScreenState extends State<ForwardTargetsScreen> {
  List<ForwardTarget> _targets = [];

  @override
  void initState() {
    super.initState();
    _loadTargets();
  }

  void _loadTargets() {
    setState(() {
      _targets = Preferences.forwardTargets;
    });
  }

  Future<void> _toggleTarget(ForwardTarget target, bool isEnabled) async {
    target.isEnabled = isEnabled;
    final index = _targets.indexWhere((t) => t.id == target.id);
    if (index != -1) {
      setState(() {
        _targets[index] = target;
      });
      await Preferences.saveForwardTargets(_targets);
    }
  }

  Future<void> _deleteTarget(ForwardTarget target) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF1E2130),
        title: const Text('Delete Target', style: TextStyle(color: Colors.white)),
        content: Text(
          'Are you sure you want to delete "${target.name}"? This target will no longer receive notifications.',
          style: const TextStyle(color: Colors.white70),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Cancel', style: TextStyle(color: Colors.white54)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: Colors.redAccent),
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('Delete', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );

    if (confirm == true) {
      setState(() {
        _targets.removeWhere((t) => t.id == target.id);
      });
      await Preferences.saveForwardTargets(_targets);
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Target deleted successfully'),
            backgroundColor: Color(0xFFEF4444),
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    }
  }

  Future<void> _navigateEdit(ForwardTarget? target) async {
    final result = await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => EditTargetScreen(target: target),
      ),
    );

    if (result == true) {
      _loadTargets();
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
          'Forwarding Channels',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: _targets.isEmpty
          ? _buildEmptyState()
          : ListView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
              itemCount: _targets.length,
              itemBuilder: (context, index) {
                final target = _targets[index];
                return _buildTargetCard(target, cardBg);
              },
            ),
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: const Color(0xFF6366F1),
        onPressed: () => _navigateEdit(null),
        icon: const Icon(Icons.add, color: Colors.white),
        label: const Text('Add Target', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.forward_to_inbox, color: Colors.white.withOpacity(0.15), size: 70),
          const SizedBox(height: 16),
          Text(
            'No forwarding channels configured',
            style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 16, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 40.0),
            child: Text(
              'Add at least one channel (REST API, Telegram, or WhatsApp) to start forwarding incoming notifications.',
              style: TextStyle(color: Colors.white.withOpacity(0.4), fontSize: 12),
              textAlign: TextAlign.center,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTargetCard(ForwardTarget target, Color cardBg) {
    IconData typeIcon;
    Color typeColor;
    String typeLabel;
    String configSnippet;

    switch (target.type) {
      case ForwardTargetType.api:
        typeIcon = Icons.api;
        typeColor = const Color(0xFF6366F1);
        typeLabel = 'API POST';
        final url = target.config['baseUrl'] ?? '';
        final endpoint = target.config['endpoint'] ?? '';
        configSnippet = url.isNotEmpty ? '$url$endpoint' : 'Not configured';
        break;
      case ForwardTargetType.telegram:
        typeIcon = Icons.send;
        typeColor = const Color(0xFF0088CC);
        typeLabel = 'Telegram Bot';
        configSnippet = 'Chat ID: ${target.config['chatId'] ?? 'None'}';
        break;
      case ForwardTargetType.whatsapp:
        typeIcon = Icons.chat;
        typeColor = const Color(0xFF25D366);
        typeLabel = 'WhatsApp';
        configSnippet = 'To: ${target.config['recipientPhone'] ?? 'None'}';
        break;
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: cardBg,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: target.isEnabled ? typeColor.withOpacity(0.3) : Colors.white.withOpacity(0.04),
          width: 1.2,
        ),
      ),
      child: Column(
        children: [
          ListTile(
            contentPadding: const EdgeInsets.fromLTRB(16, 8, 8, 8),
            leading: Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: typeColor.withOpacity(0.12),
                shape: BoxShape.circle,
              ),
              child: Icon(typeIcon, color: typeColor, size: 22),
            ),
            title: Row(
              children: [
                Expanded(
                  child: Text(
                    target.name,
                    style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(
                    color: typeColor.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    typeLabel,
                    style: TextStyle(color: typeColor, fontSize: 9, fontWeight: FontWeight.bold),
                  ),
                ),
                const SizedBox(width: 8),
              ],
            ),
            subtitle: Padding(
              padding: const EdgeInsets.only(top: 4.0),
              child: Text(
                configSnippet,
                style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 12),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ),
            trailing: Switch(
              value: target.isEnabled,
              activeColor: typeColor,
              activeTrackColor: typeColor.withOpacity(0.3),
              inactiveThumbColor: Colors.white54,
              inactiveTrackColor: Colors.white12,
              onChanged: (val) => _toggleTarget(target, val),
            ),
          ),
          const Divider(height: 1, color: Colors.white10),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 4.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                TextButton.icon(
                  onPressed: () => _navigateEdit(target),
                  icon: const Icon(Icons.edit, size: 14, color: Colors.white70),
                  label: const Text('Edit', style: TextStyle(color: Colors.white70, fontSize: 12)),
                ),
                const SizedBox(width: 8),
                TextButton.icon(
                  onPressed: () => _deleteTarget(target),
                  icon: const Icon(Icons.delete_outline, size: 14, color: Colors.redAccent),
                  label: const Text('Delete', style: TextStyle(color: Colors.redAccent, fontSize: 12)),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
