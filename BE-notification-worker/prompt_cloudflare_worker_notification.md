# Prompt: Cloudflare Worker — Payment Notification Receiver

## Goal
Build a Cloudflare Worker (TypeScript) that acts as the backend endpoint for receiving payment
notification POSTs from a Flutter Android app, storing them to D1 database, and optionally
forwarding to other services.

---

## Tech Stack

- Cloudflare Workers (TypeScript)
- Cloudflare D1 (SQLite — store notification history)
- Cloudflare KV (store config/settings)
- Wrangler CLI for local dev and deploy
- No external frameworks — vanilla Worker fetch handler

---

## Project Structure

```
notification-worker/
├── src/
│   └── index.ts          # Main Worker entry point
├── schema.sql            # D1 table definitions
├── wrangler.toml         # Cloudflare config (bindings, routes)
├── package.json
├── tsconfig.json
└── README.md
```

---

## API Endpoints

### POST /notify
Receive notification from Flutter app.

**Request headers:**
```
Content-Type: application/json
X-API-Secret: <secret_token>
```

**Request body:**
```json
{
  "source_app": "id.co.bri.merchant",
  "source_app_label": "BRImerchant",
  "title": "Pembayaran Diterima",
  "text": "QRIS Rp150.000 berhasil",
  "big_text": "Pembayaran QRIS sebesar Rp150.000 berhasil diterima",
  "nominal_raw": "Rp150.000",
  "nominal": 150000,
  "received_at": "2025-06-05T07:30:00Z",
  "notif_id": 12345
}
```

**Response 200:**
```json
{ "ok": true, "id": "<uuid>" }
```

**Response 401** (wrong/missing secret):
```json
{ "ok": false, "error": "Unauthorized" }
```

**Response 400** (invalid body):
```json
{ "ok": false, "error": "Invalid payload" }
```

---

### GET /notifications
Retrieve notification history (for dashboard/monitoring).

**Query params:**
- `limit` — number of rows (default: 50, max: 200)
- `offset` — pagination offset (default: 0)
- `source_app` — filter by package name (optional)

**Request headers:**
```
X-API-Secret: <secret_token>
```

**Response 200:**
```json
{
  "ok": true,
  "total": 120,
  "data": [
    {
      "id": "uuid",
      "source_app": "id.co.bri.merchant",
      "source_app_label": "BRImerchant",
      "title": "Pembayaran Diterima",
      "text": "QRIS Rp150.000 berhasil",
      "nominal": 150000,
      "received_at": "2025-06-05T07:30:00Z",
      "created_at": "2025-06-05T07:30:05Z"
    }
  ]
}
```

---

### GET /health
Public endpoint, no auth required.

**Response 200:**
```json
{ "ok": true, "timestamp": "2025-06-05T07:30:00Z" }
```

---

## D1 Schema (schema.sql)

```sql
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
```

---

## wrangler.toml

```toml
name = "notification-worker"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[[d1_databases]]
binding = "DB"
database_name = "notifications-db"
database_id = "YOUR_D1_DATABASE_ID"

[[kv_namespaces]]
binding = "CONFIG"
id = "YOUR_KV_NAMESPACE_ID"

[vars]
ENVIRONMENT = "production"
```

Secrets (set via `wrangler secret put`):
- `API_SECRET` — token for authenticating Flutter app requests

---

## src/index.ts — Full Implementation

Implement the following:

### Types

```typescript
interface Env {
  DB: D1Database;
  CONFIG: KVNamespace;
  API_SECRET: string;
  ENVIRONMENT: string;
}

interface NotificationPayload {
  source_app: string;
  source_app_label?: string;
  title?: string;
  text?: string;
  big_text?: string;
  nominal_raw?: string;
  nominal?: number;
  notif_id?: number;
  received_at?: string;
}
```

### Router logic (no framework, plain if/else on `url.pathname`)

```
POST /notify       → handleNotify(request, env)
GET  /notifications → handleList(request, env)
GET  /health       → handleHealth()
*                  → 404 JSON
```

### handleNotify

1. Check `X-API-Secret` header matches `env.API_SECRET` → 401 if not
2. Parse JSON body → 400 if invalid or `source_app` missing
3. Generate UUID: `crypto.randomUUID()`
4. Insert into D1 `notifications` table
5. Return `{ ok: true, id }`

### handleList

1. Check `X-API-Secret` header → 401 if not
2. Parse `limit`, `offset`, `source_app` from query params
3. Query D1 with optional WHERE clause
4. Return paginated JSON

### handleHealth

Return `{ ok: true, timestamp: new Date().toISOString() }`

### Auth helper

```typescript
function isAuthorized(request: Request, env: Env): boolean {
  const secret = request.headers.get('X-API-Secret');
  return secret === env.API_SECRET;
}
```

### CORS headers

Add these headers to ALL responses to allow Flutter app calls:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, X-API-Secret
```
Handle `OPTIONS` preflight → return 204.

---

## README.md — Setup Steps

Include these sections:

### 1. Prerequisites
- Node.js 18+
- Wrangler CLI: `npm install -g wrangler`
- Cloudflare account (free)

### 2. First-time Setup
```bash
# Login ke Cloudflare
wrangler login

# Buat D1 database
wrangler d1 create notifications-db

# Buat KV namespace
wrangler kv:namespace create CONFIG

# Jalankan schema SQL
wrangler d1 execute notifications-db --file=./schema.sql

# Set secret token
wrangler secret put API_SECRET
# (masukkan token bebas, contoh: mysecrettoken123)
```

### 3. Update wrangler.toml
Paste `database_id` dan `kv namespace id` dari output command di atas ke `wrangler.toml`.

### 4. Deploy
```bash
npm install
wrangler deploy
```
Output: `https://notification-worker.<your-subdomain>.workers.dev`

### 5. Test
```bash
# Health check
curl https://notification-worker.<subdomain>.workers.dev/health

# Test POST
curl -X POST https://notification-worker.<subdomain>.workers.dev/notify \
  -H "Content-Type: application/json" \
  -H "X-API-Secret: mysecrettoken123" \
  -d '{
    "source_app": "id.co.bri.merchant",
    "source_app_label": "BRImerchant",
    "title": "Pembayaran Diterima",
    "text": "QRIS Rp150.000 berhasil",
    "nominal": 150000,
    "received_at": "2025-06-05T07:30:00Z"
  }'

# List notifications
curl https://notification-worker.<subdomain>.workers.dev/notifications \
  -H "X-API-Secret: mysecrettoken123"
```

### 6. Hubungkan ke Flutter App
Di `lib/services/api_service.dart`, set:
```dart
static const String _baseUrl = 'https://notification-worker.<subdomain>.workers.dev';
static const String _endpoint = '/notify';
static const String _apiKey  = 'mysecrettoken123'; // sama dengan API_SECRET
```

---

## Edge Cases to Handle

- Body bukan JSON valid → return 400, jangan crash
- `nominal` bukan number → simpan sebagai NULL, jangan reject request
- `received_at` kosong → isi dengan server time (`new Date().toISOString()`)
- Request selain POST/GET → return 405 Method Not Allowed
- D1 insert gagal → return 500 dengan pesan error (jangan expose stack trace)

---

## Out of Scope

- Authentication berbasis JWT (cukup shared secret untuk use case ini)
- Rate limiting per IP (Cloudflare WAF free sudah cover basic protection)
- Forward ke third-party (Telegram, WhatsApp) — bisa ditambahkan sebagai langkah lanjutan
- Dashboard UI (bisa dibuat terpisah sebagai Cloudflare Pages)
