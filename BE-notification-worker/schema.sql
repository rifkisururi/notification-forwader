CREATE TABLE IF NOT EXISTS notifications (
  id          TEXT PRIMARY KEY,           -- UUID v4
  source_app  TEXT NOT NULL,              -- package name
  source_app_label TEXT,                  -- app display name
  title       TEXT,
  text        TEXT,
  big_text    TEXT,
  nominal_raw TEXT,
  nominal     INTEGER,                    -- in rupiah, nullable
  notif_id    INTEGER,
  received_at TEXT,                       -- ISO8601 from device
  created_at  TEXT NOT NULL               -- ISO8601 server time
);

CREATE INDEX IF NOT EXISTS idx_notifications_created_at
  ON notifications(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_source_app
  ON notifications(source_app);

CREATE TABLE IF NOT EXISTS admin_settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS forwarding_rules (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  type        TEXT NOT NULL,
  enabled     INTEGER NOT NULL DEFAULT 1,
  config      TEXT NOT NULL,
  created_at  TEXT NOT NULL
);
