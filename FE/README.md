# Notification Forwarder

A premium Flutter Android application that monitors notifications from selected apps and forwards them in real-time to an internal REST API endpoint. Designed for SaaS transaction systems, payment gateway notifications, or order routing pipelines.

---

## 🚀 Core Features

1. **App Selector Interface**: Allows the user to search, filter, and multi-select installed applications to monitor.
2. **Native Notification Interceptor**: Uses a custom Android `NotificationListenerService` to intercept incoming notifications in real-time.
3. **Queueing Strategy**: Notifications captured while the Flutter UI/Engine is not active are queued in Kotlin and flushed automatically once the Flutter instance becomes active.
4. **Intelligent Deduplication**: Uses a compound key (`packageName:notifId:text`) to prevent double-forwarding of identical notifications.
5. **Regex Amount Parser**: Automatically attempts to extract financial nominal values (e.g. `Rp150.000` or `IDR 50.000`) for quick scanning.
6. **Robust Network Handler**: Outbox pattern with a 10-second timeout and 1-time retry delay of 5 seconds on connection failures.
7. **Connection Tester**: Test endpoints with a dummy payload directly from the settings drawer.

---

## 🛠️ Tech Stack

- **Flutter 3.x** & **Dart** (App Frontend)
- **Kotlin** (Android native service layer)
- **`shared_preferences`** (Local settings & outbox log storage)
- **`installed_apps`** (Listing & querying applications)
- **`http`** (REST integrations)

---

## 📦 API Payload Format

The app sends a `POST` request to the configured REST URL (e.g., `https://api.domain.com/api/notification`) with the following JSON structure:

```json
{
  "source_app": "id.co.bri.merchant",
  "source_app_label": "BRImerchant",
  "title": "Pembayaran Diterima",
  "text": "QRIS Rp150.000 berhasil",
  "big_text": "Pembayaran QRIS sebesar Rp150.000 berhasil diterima",
  "received_at": "2026-06-06T11:45:00Z",
  "notif_id": 12345
}
```

- **Authentication Header**: Optional `Authorization: Bearer <token>` is sent if configured.
- **Content-Type**: `application/json`

---

## ⚙️ Setup & Permissions Guide

To run this app reliably on Android devices, three key settings must be configured:

### 1. Enable Notification Access (Permission Gate)
By default, Android isolates apps from reading system notifications. 
1. Open the application.
2. A banner at the top will indicate **"Permission Required"** (Orange).
3. Tap the banner to open the Android system's **Notification Access** settings.
4. Locate **"Notification Forwarder Service"** (or **"notif"**) and toggle it **ON** (Allow).
5. Return to the application. The banner will turn **Green ("Notification Access: Enabled & Active")**.

### 2. Configure API Endpoint & Credentials
1. Open the **left-hand navigation drawer** by swiping from the left edge or clicking the menu icon.
2. Enter your **API Base URL** (e.g., `https://my-internal-api.com`).
3. Enter your target **Endpoint** path (default is `/api/notification`).
4. (Optional) Provide a **Bearer Token** for secure authentication.
5. Tap **"Test Connection"** to verify connection details. The app will submit a test request and report the HTTP status code.
6. Tap **"Save Settings"** to persist.

### 3. Disable Battery Optimization (Critical for 24/7 background operation)
Android's aggressive battery management ("Doze mode") will shut down background services if the device goes idle. To prevent this:
1. Go to your device **Settings**.
2. Tap **Apps** or **App Management**.
3. Find and tap **"Notif Forwarder"** (or **"notif"**).
4. Tap **Battery** or **Battery Usage**.
5. Change the setting from *Optimized* (or *Restricted*) to **Unrestricted**.
6. (Device-Specific) On Chinese OEM ROMs (Xiaomi, Oppo, Vivo, OnePlus), ensure you pin/lock the app in the recent apps tray and enable **Autostart**.

---

## 📂 File Directory

```
lib/
├── main.dart                   # App bootstrapper + Theme config
├── screens/
│   ├── home_screen.dart        # Log list, permission gate, inline settings drawer
│   └── app_selector_screen.dart# Searchable multi-select app list
├── services/
│   ├── notification_service.dart # MethodChannel handler, outbox retry, deduplication
│   └── api_service.dart        # HTTP poster & connection tester
├── models/
│   └── notification_payload.dart # Models for API payload & local logs, nominal parser
└── utils/
    └── preferences.dart        # SharedPreferences wrapper

android/app/src/main/
├── AndroidManifest.xml         # Registers background service & QUERY_ALL_PACKAGES permission
└── kotlin/com/example/notif/
    ├── MainActivity.kt         # Exposes native methods & caches FlutterEngine
    └── NotifListenerService.kt # Captures notifications and relays them to MethodChannel
```
