# Prompt: Flutter Android App — Notification Forwarder

## Goal
Build a Flutter Android app that listens to notifications from user-selected apps and forwards them to an internal REST API via HTTP POST.

---

## Core Features

1. **App Selector UI** — user can pick which installed apps to monitor (multi-select with app icon + name)
2. **NotificationListenerService** (Kotlin) — captures notifications from selected apps in real-time
3. **MethodChannel bridge** — passes notification data from Kotlin to Flutter
4. **HTTP POST to internal API** — forwards parsed notification payload as JSON
5. **Log screen** — shows history of captured + forwarded notifications with status (sent / failed)
6. **Persistent settings** — selected apps saved to SharedPreferences, survives app restart
7. **Permission gate** — detects if Notification Access is granted, opens settings if not

---

## Tech Stack

- Flutter 3.x (Dart)
- Kotlin (Android native layer)
- `http` package for REST calls
- `shared_preferences` for saving selected apps
- `installed_apps` or `device_apps` package to list installed apps
- Material 3 UI

---

## File Structure

```
lib/
├── main.dart                   # App entry, MaterialApp
├── screens/
│   ├── home_screen.dart        # Log of forwarded notifications
│   └── app_selector_screen.dart # Pick which apps to monitor
├── services/
│   ├── notification_service.dart  # MethodChannel handler + forward logic
│   └── api_service.dart           # HTTP POST to internal API
├── models/
│   └── notification_payload.dart  # Data model + JSON serializer
└── utils/
    └── preferences.dart           # SharedPreferences wrapper

android/app/src/main/
├── AndroidManifest.xml
└── kotlin/.../
    ├── MainActivity.kt             # FlutterEngine cache + MethodChannel setup
    └── NotifListenerService.kt     # NotificationListenerService implementation
```

---

## Notification Payload (JSON POST to API)

```json
{
  "source_app": "id.co.bri.merchant",
  "source_app_label": "BRImerchant",
  "title": "Pembayaran Diterima",
  "text": "QRIS Rp150.000 berhasil",
  "big_text": "Pembayaran QRIS sebesar Rp150.000 berhasil diterima",
  "received_at": "2025-06-05T07:30:00Z",
  "notif_id": 12345
}
```

---

## API Configuration (user-configurable in app settings)

- Base URL: configurable via in-app settings screen (saved to SharedPreferences)
- Endpoint: `/api/notification` (default, configurable)
- Auth header: `Authorization: Bearer <token>` (optional, configurable)
- Timeout: 10 seconds
- On failure: retry once after 5 seconds, then mark as "failed" in log

---

## Android Native (Kotlin)

### NotifListenerService.kt

- Extends `NotificationListenerService`
- On `onNotificationPosted(sbn: StatusBarNotification)`:
  - Check if `sbn.packageName` is in the monitored list (passed from Flutter via SharedPreferences or MethodChannel)
  - Extract `title`, `text`, `bigText`, `postTime` from `sbn.notification.extras`
  - Send to Flutter via:
    ```kotlin
    MethodChannel(engine.dartExecutor.binaryMessenger, CHANNEL)
        .invokeMethod("onNotification", jsonPayload)
    ```
- Use `FlutterEngineCache` to access the cached engine from `MainActivity`

### MainActivity.kt

- Cache `FlutterEngine` with key `"main_engine"` using `FlutterEngineCache`
- Expose MethodChannel methods to Flutter:
  - `isPermissionGranted` → Boolean
  - `openNotificationSettings` → void
  - `updateMonitoredPackages(List<String>)` → void (update filter list in service)

### AndroidManifest.xml

```xml
<service
    android:name=".NotifListenerService"
    android:exported="false"
    android:permission="android.permission.BIND_NOTIFICATION_LISTENER_SERVICE">
    <intent-filter>
        <action android:name="android.service.notification.NotificationListenerService" />
    </intent-filter>
</service>
```

---

## Flutter Screens

### HomeScreen

- AppBar: "Notification Forwarder"
- Banner (top): green if permission granted, orange (tappable) if not
- Body: `ListView` of forwarded notifications
  - Each card: app icon, app name, title, text, nominal (if parseable), timestamp, status badge (sending / sent ✓ / failed ✗)
- FAB or top-right icon: navigate to AppSelectorScreen

### AppSelectorScreen

- List all installed apps (non-system, with icon + package name)
- Checkbox multi-select
- Search bar to filter by app name
- "Save" button → persist to SharedPreferences → update Kotlin service filter list via MethodChannel

### Settings (optional inline in HomeScreen drawer)

- API Base URL input
- Endpoint input
- Bearer token input
- "Test Connection" button → sends a dummy POST and shows response code

---

## State Management

Use `StatefulWidget` + `setState` (no Riverpod/Bloc needed for this scope).

---

## Edge Cases to Handle

- App killed by Android battery optimizer → document how to disable battery optimization for the app
- Notification arrives when Flutter engine not yet initialized → queue in Kotlin, flush on engine ready
- Duplicate notifications (same `notif_id`) → deduplicate in Flutter before forwarding
- API unreachable → show "failed ✗" in log, do not retry infinitely

---

## Out of Scope

- iOS support (NotificationListenerService is Android-only)
- Background service persistence via WorkManager (keep it simple)
- Notification reply/actions

---

## Deliverables

1. All Dart files under `lib/`
2. `MainActivity.kt` and `NotifListenerService.kt`
3. Updated `AndroidManifest.xml`
4. `pubspec.yaml` with all dependencies
5. `README.md` with setup steps:
   - How to enable Notification Access
   - How to configure API URL
   - How to disable battery optimization

---

## Example: services/api_service.dart skeleton

```dart
class ApiService {
  static Future<bool> forward(NotificationPayload payload) async {
    final prefs = await SharedPreferences.getInstance();
    final baseUrl = prefs.getString('api_base_url') ?? '';
    final endpoint = prefs.getString('api_endpoint') ?? '/api/notification';
    final token = prefs.getString('api_token') ?? '';

    try {
      final res = await http.post(
        Uri.parse('$baseUrl$endpoint'),
        headers: {
          'Content-Type': 'application/json',
          if (token.isNotEmpty) 'Authorization': 'Bearer $token',
        },
        body: jsonEncode(payload.toJson()),
      ).timeout(const Duration(seconds: 10));

      return res.statusCode >= 200 && res.statusCode < 300;
    } catch (_) {
      return false;
    }
  }
}
```
