# Notification Worker

A TypeScript Cloudflare Worker that acts as a backend endpoint for receiving payment notifications from a Flutter Android app, storing them to a Cloudflare D1 database, and providing a premium web dashboard with admin authentication to view and manage notification logs.

## Core Features
*   **Web Dashboard UI** — A beautiful, responsive glassmorphic dark-mode interface to monitor and search notifications.
*   **Secure Authentication** — Single-user login system using SHA-256 password hashing and session tokens stored in Cloudflare KV.
*   **Changeable Credentials** — Admin can dynamically update their username and password directly from the dashboard settings.
*   **Real-time Stats** — At-a-glance analytics showing total notifications, today's count, nominal counts, and unique app sources.

## Web Dashboard Routes
*   `GET /dashboard` — Serves the main admin monitoring panel. Redirects to `/login` if not authenticated.
*   `GET /login` — Serves the login page. Redirects to `/dashboard` if already authenticated.
*   `GET /` — Automatically redirects to `/dashboard`.

## API Endpoints

### 1. `GET /health`
Public health check endpoint.
* **Headers:** None required.
* **Response (200):**
  ```json
  { "ok": true, "timestamp": "2026-06-06T12:00:00.000Z" }
  ```

### 2. `POST /notify`
Receive and record notification payload.
* **Headers:**
  * `Content-Type: application/json`
  * `X-API-Secret: <secret_token>`
* **Body:**
  ```json
  {
    "source_app": "id.co.bri.merchant",
    "source_app_label": "BRImerchant",
    "title": "Pembayaran Diterima",
    "text": "QRIS Rp150.000 berhasil",
    "big_text": "Pembayaran QRIS sebesar Rp150.000 berhasil diterima",
    "nominal_raw": "Rp150.000",
    "nominal": 150000,
    "device_name": "HP Kasir 1",
    "received_at": "2025-06-05T07:30:00Z",
    "notif_id": 12345
  }
  ```
* **Response (200):**
  ```json
  { "ok": true, "id": "<uuid>" }
  ```

### 3. `GET /notifications`
Retrieve paginated notification history.
* **Headers:**
  * `X-API-Secret: <secret_token>`
* **Query Parameters:**
  * `limit` (optional): Number of records (default: `50`, max: `200`)
  * `offset` (optional): Pagination offset (default: `0`)
  * `source_app` (optional): Filter by package name
* **Response (200):**
  ```json
  {
    "ok": true,
    "total": 1,
    "data": [
      {
        "id": "uuid",
        "source_app": "id.co.bri.merchant",
        "source_app_label": "BRImerchant",
        "title": "Pembayaran Diterima",
        "text": "QRIS Rp150.000 berhasil",
        "nominal": 150000,
        "device_name": "HP Kasir 1",
        "received_at": "2025-06-05T07:30:00Z",
        "created_at": "2025-06-05T07:30:05Z"
      }
    ]
  }
  ```

---

## Admin Credentials
*   **Default Username:** `admin`
*   **Default Password:** `123456`
*   You can change these credentials on the **Ganti Kredensial** tab within the Web Dashboard.

---

## Setup Instructions

### 1. Prerequisites
* **Node.js** (v18 or higher)
* **Wrangler CLI** (globally or locally): `npm install -g wrangler`
* A **Cloudflare Account** (Free tier is sufficient)

### 2. First-time Setup
First, log in to your Cloudflare account via Wrangler:
```bash
wrangler login
```

Create the D1 database:
```bash
wrangler d1 create notifications-db
```
*Take note of the `database_id` returned in the output.*

Create the KV namespace (used for admin session storage):
```bash
wrangler kv:namespace create CONFIG
```
*Take note of the `id` returned in the output.*

Initialize the database schema:
```bash
wrangler d1 execute notifications-db --file=./schema.sql
# For local development:
wrangler d1 execute notifications-db --local --file=./schema.sql
```

Set the API Secret token (use a strong random string for your Flutter API forwarding):
```bash
wrangler secret put API_SECRET
# Enter a secret token when prompted, e.g., mysecrettoken123
```

### 3. Update wrangler.toml
Open `wrangler.toml` and replace:
* `YOUR_D1_DATABASE_ID` with the actual database ID from step 2.
* `YOUR_KV_NAMESPACE_ID` with the actual KV ID from step 2.

### 4. Install & Deploy
Install dependencies:
```bash
npm install
```

Deploy the worker:
```bash
wrangler deploy
```
*Output will provide your worker URL (e.g. `https://notification-worker.<subdomain>.workers.dev`).*

---

## Testing the Worker

### Health Check
```bash
curl https://notification-worker.<subdomain>.workers.dev/health
```

### Send Notification
```bash
curl -X POST https://notification-worker.<subdomain>.workers.dev/notify \
  -H "Content-Type: application/json" \
  -H "X-API-Secret: mysecrettoken123" \
  -d '{
    "source_app": "id.co.bri.merchant",
    "source_app_label": "BRImerchant",
    "title": "Pembayaran Diterima",
    "text": "QRIS Rp150.000 berhasil",
    "nominal": 150000,
    "device_name": "HP Kasir 1",
    "received_at": "2025-06-05T07:30:00Z"
  }'
```

### List Notifications
```bash
curl https://notification-worker.<subdomain>.workers.dev/notifications \
  -H "X-API-Secret: mysecrettoken123"
```

---

## Integration with Flutter App
In your Flutter app (`lib/services/api_service.dart`), configure the API settings:
```dart
static const String _baseUrl = 'https://notification-worker.<subdomain>.workers.dev';
static const String _endpoint = '/notify';
static const String _apiKey  = 'mysecrettoken123'; // Matches API_SECRET
```
