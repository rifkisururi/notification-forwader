# 🔔 NotifForwarder

**Sistem Notifikasi Pembayaran Terpusat** — SaaS notification forwarding untuk merchant Indonesia yang menerima pembayaran dari berbagai e-wallet & banking app.

## 📋 Tentang Project

NotifForwarder membantu merchant memantau notifikasi pembayaran dari berbagai aplikasi (GoPay, ShopeePay, OVO, BRI, BCA, Mandiri, dll.) secara **real-time** dan terpusat. Notifikasi yang masuk ke HP Android akan diteruskan ke backend dan bisa di-relay ke channel komunikasi tim (Telegram, Discord, WhatsApp, atau custom webhook).

### Arsitektur

```
┌─────────────────────┐       ┌──────────────────────────┐       ┌─────────────────┐
│   Android App (FE)  │──────▶│  Cloudflare Worker (BE)   │──────▶│  Telegram Bot   │
│   Flutter + Kotlin  │ HTTP  │  + D1 Database            │ async │  Discord        │
│                     │ POST  │  + KV Session Storage     │       │  WhatsApp       │
└─────────────────────┘       └──────────────────────────┘       │  Custom Webhook │
                                    │                            └─────────────────┘
                                    ▼
                              ┌─────────────┐
                              │  Web Admin  │
                              │  Dashboard  │
                              └─────────────┘
```

## ✨ Fitur Utama

### 📱 Android App (Flutter)
- **Notification Listener** — Intercept notifikasi dari app yang dipilih secara real-time
- **Deduplikasi** — Mencegah pengiriman notifikasi ganda dengan compound key
- **Parsing Nominal** — Ekstraksi otomatis nominal Rupiah (Rp150.000, IDR 50.000, dll.)
- **App Selector** — Pilih aplikasi mana saja yang ingin dimonitor
- **Connection Tester** — Tes koneksi ke backend sebelum mulai
- **Log Viewer** — Riwayat notifikasi yang sudah diteruskan
- **Retry Logic** — Outbox pattern dengan 1x retry otomatis

### 🖥️ Backend (Cloudflare Worker)
- **API Endpoint** — `POST /notify` untuk menerima notifikasi dari Android app
- **Web Dashboard** — Admin panel lengkap dengan login, statistik, dan manajemen notifikasi
- **Forwarding Rules** — Teruskan notifikasi ke berbagai channel:
  - 🤖 Telegram Bot
  - 💬 Discord Webhook
  - 📲 WhatsApp (Meta Cloud API)
  - 🔗 Custom Webhook
- **Multi-rule** — Bisa aktifkan beberapa forwarding rule sekaligus
- **Session Auth** — Login dengan KV-backed session (7 hari expiry)
- **Responsive** — Dashboard responsif untuk mobile & desktop

## 🛠️ Tech Stack

| Komponen | Teknologi |
|----------|-----------|
| **Frontend (Mobile)** | Flutter 3.x, Dart, Kotlin (NotificationListenerService) |
| **Backend** | Cloudflare Workers, TypeScript |
| **Database** | Cloudflare D1 (SQLite) |
| **Session Storage** | Cloudflare KV |
| **Deployment** | Wrangler CLI |

## 📁 Struktur Project

```
notif/
├── FE-MobileApp/                    # Flutter Android App
│   ├── lib/
│   │   ├── main.dart                # Entry point & theme
│   │   ├── screens/
│   │   │   ├── home_screen.dart      # Main UI: log notifikasi & settings
│   │   │   └── app_selector_screen.dart  # Pilih app yang dimonitor
│   │   ├── services/
│   │   │   ├── notification_service.dart  # MethodChannel bridge & dedup
│   │   │   └── api_service.dart          # HTTP POST forwarding
│   │   ├── models/
│   │   │   └── notification_payload.dart  # Data models & nominal parser
│   │   └── utils/
│   │       └── preferences.dart          # SharedPreferences wrapper
│   ├── android/app/src/main/kotlin/    # Kotlin: NotificationListenerService
│   └── pubspec.yaml
│
├── FE-LandingPage/                  # Landing Page Web (Cloudflare Worker)
│   ├── src/
│   │   ├── index.ts                 # Entry point & router
│   │   ├── html.ts                  # HTML template
│   │   ├── css.ts                   # CSS styling
│   │   └── js.ts                    # Interactivity script
│   ├── wrangler.toml
│   └── package.json
│
├── BE-notification-worker/           # Cloudflare Worker Backend
│   ├── src/
│   │   ├── index.ts                  # Routing, API handlers, forwarding logic
│   │   └── ui.ts                     # Inline HTML untuk web dashboard
│   ├── schema.sql                    # D1 table definitions
│   ├── seed_data.sql                 # Sample notification data
│   ├── seed_forwarding.sql           # Sample forwarding rules
│   ├── wrangler.toml                 # Cloudflare config
│   └── package.json
│
└── README.md
```

## 🚀 Setup & Instalasi

### Backend (Cloudflare Worker)

```bash
cd BE-notification-worker

# Install dependencies
npm install

# Login ke Cloudflare
npx wrangler login

# Buat D1 database
npx wrangler d1 create notifications-db

# Update database_name di wrangler.toml dengan ID yang didapat

# Apply schema
npx wrangler d1 execute notifications-db --file=./schema.sql

# (Opsional) Seed sample data
npx wrangler d1 execute notifications-db --file=./seed_data.sql
npx wrangler d1 execute notifications-db --file=./seed_forwarding.sql

# Set API secret
npx wrangler secret put API_SECRET

# Jalankan lokal
npm run dev

# Deploy ke Cloudflare
npm run deploy
```

**Default login dashboard:** `admin` / `123456`

### Frontend (Flutter Android App)

```bash
cd FE-MobileApp

# Install dependencies
flutter pub get

# Run di device/emulator
flutter run
```

### Landing Page (Cloudflare Worker)

```bash
cd FE-LandingPage

# Install dependencies
npm install

# Jalankan lokal
npm run dev

# Deploy ke Cloudflare
npm run deploy
```


**Setup di Android:**
1. Buka **Settings → Apps → Special access → Notification access**
2. Aktifkan akses notifikasi untuk app NotifForwarder
3. Di dalam app, buka **Settings Drawer** dan masukkan URL backend (mis: `https://notifforwader.rifki.my.id`)
4. Pilih aplikasi yang ingin dimonitor melalui App Selector
5. (Opsional) Disable battery optimization untuk operasi 24/7 di background

## 🔌 API Endpoints

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| `POST` | `/notify` | Terima notifikasi dari Android app | `X-API-Secret` header |
| `GET` | `/notifications` | Daftar notifikasi (paginasi, filter) | — |
| `GET` | `/health` | Health check | — |
| `GET` | `/login` | Halaman login admin dashboard | — |
| `GET` | `/dashboard` | Admin dashboard | Session cookie |
| `POST` | `/api/auth/login` | Login admin | — |
| `POST` | `/api/auth/logout` | Logout admin | Session cookie |
| `GET/POST` | `/api/admin/settings` | Lihat/update pengaturan | Session cookie |
| `POST` | `/api/admin/settings/credentials` | Ubah username/password | Session cookie |
| `GET/POST` | `/api/admin/forwarding` | CRUD forwarding rules | Session cookie |
| `POST` | `/api/admin/forwarding/toggle` | Enable/disable rule | Session cookie |
| `POST` | `/api/admin/forwarding/delete` | Hapus rule | Session cookie |
| `POST` | `/api/admin/forwarding/test` | Test forwarding rule | Session cookie |

## 💾 Database Schema

### Tabel `notifications`
| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| `id` | TEXT (UUID) | Primary key |
| `source_app` | TEXT | Package name app sumber |
| `source_app_label` | TEXT | Nama app sumber |
| `title` | TEXT | Judul notifikasi |
| `text` | TEXT | Isi notifikasi |
| `big_text` | TEXT | Isi lengkap notifikasi |
| `nominal_raw` | TEXT | Nominal asli (string) |
| `nominal` | INTEGER | Nominal dalam angka |
| `notif_id` | INTEGER | ID notifikasi Android |
| `received_at` | TEXT | Waktu diterima (ISO8601) |
| `created_at` | TEXT | Waktu disimpan (ISO8601) |

### Tabel `forwarding_rules`
| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| `id` | TEXT (UUID) | Primary key |
| `name` | TEXT | Nama rule |
| `type` | TEXT | `telegram` / `discord` / `whatsapp` / `custom` |
| `enabled` | INTEGER | 0 = disabled, 1 = enabled |
| `config` | TEXT | JSON config (token, webhook url, dll.) |
| `created_at` | TEXT | Waktu dibuat (ISO8601) |

## 🔒 Keamanan

- API dilindungi oleh `X-API-Secret` header
- Admin dashboard menggunakan session-based auth dengan SHA-256 password hashing
- Session disimpan di Cloudflare KV dengan expiry 7 hari
- Credentials default harus diubah setelah deployment pertama

## 📄 Lisensi

Project ini bersifat privat. Semua hak dilindungi.
