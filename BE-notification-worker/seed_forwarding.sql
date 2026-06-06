INSERT OR IGNORE INTO forwarding_rules (id, name, type, enabled, config, created_at) VALUES 
('rule-uuid-1', 'Webhook Utama (Server A)', 'custom', 1, '{"custom_url": "https://httpbin.org/post", "custom_headers": "{\\"X-App-Env\\": \\"production\\"}"}', '2026-06-06T20:00:00.000Z'),
('rule-uuid-2', 'Webhook Cadangan (Server B)', 'custom', 0, '{"custom_url": "https://webhook.site/dummy-endpoint", "custom_headers": "{}"}', '2026-06-06T20:05:00.000Z'),
('rule-uuid-3', 'Telegram Finansial Grup', 'telegram', 1, '{"bot_token": "123456789:ABCdef-dummy-token", "chat_id": "-100123456789"}', '2026-06-06T20:10:00.000Z'),
('rule-uuid-4', 'Discord Alert Pembayaran', 'discord', 1, '{"webhook_url": "https://discord.com/api/webhooks/9999/dummy-webhook"}', '2026-06-06T20:15:00.000Z');
