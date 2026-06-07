# Notification Forwarder (FE-MobileApp)

Aplikasi Flutter Android premium yang dirancang untuk mendengarkan (intercept) notifikasi dari aplikasi terpilih secara real-time dan meneruskannya (*forwarding*) ke REST API endpoint internal melalui protokol HTTP POST. Sangat ideal untuk integrasi dengan sistem transaksi SaaS, payment gateway (QRIS/Mutasi Bank), atau perutean order otomatis.

---

## 🚀 Fitur Utama

1. **App Selector Interface**: Antarmuka bagi pengguna untuk mencari, memfilter, dan memilih beberapa aplikasi terinstal secara bersamaan untuk dipantau.
2. **Native Notification Interceptor**: Menggunakan layanan kustom Android `NotificationListenerService` di latar belakang untuk menangkap notifikasi sistem secara real-time.
3. **Queueing Strategy**: Menyimpan notifikasi yang masuk ketika engine/antarmuka Flutter sedang tidak aktif dalam antrean Kotlin, lalu mengirimkannya kembali (*flush*) secara otomatis setelah Flutter aktif.
4. **Deduplikasi Cerdas**: Menggunakan *compound key* (`packageName:notifId:text`) untuk mencegah pengiriman ulang notifikasi yang identik ke API.
5. **Regex Amount Parser**: Secara otomatis mengekstrak nilai nominal finansial (misalnya: `Rp150.000` atau `IDR 50.000`) dari isi teks notifikasi untuk kebutuhan pemantauan transaksi cepat.
6. **Configurable & Manual Retry**: Dilengkapi batas waktu respons 10 detik, setelan jumlah percobaan ulang (Max Retries) serta jeda waktu (Delay) yang dapat disesuaikan di drawer pengaturan, dan tombol "Retry Sending" untuk mengirim ulang notifikasi yang gagal secara manual.
7. **Connection Tester**: Memiliki fitur pengujian endpoint menggunakan dummy payload secara langsung dari panel pengaturan samping (*settings drawer*).

---

## 🛠️ Tech Stack & Dependensi

*   **Flutter 3.x** & **Dart** (App Frontend & Logika Pengiriman)
*   **Kotlin** (Android native service layer)
*   **`shared_preferences`** (Penyimpanan konfigurasi lokal & logs)
*   **`installed_apps`** (Listing & querying aplikasi terinstal)
*   **`http`** (Integrasi REST API client)

---

## 📦 Format Payload API

Aplikasi mengirimkan permintaan `POST` ke URL REST API yang dikonfigurasi (contoh: `https://api.domain.com/api/notification`) dengan struktur JSON seperti berikut:

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

*   **Header Autentikasi**: Opsional `Authorization: Bearer <token>` akan dikirim jika dikonfigurasi pada setelan drawer aplikasi.
*   **Content-Type**: `application/json`

---

## ⚙️ Panduan Setelan & Izin (Penting)

Untuk memastikan aplikasi ini berjalan stabil 24/7 di latar belakang Android, ikuti tiga langkah konfigurasi berikut:

### 1. Aktifkan Akses Notifikasi (Notification Access Permission)
Secara default, Android membatasi akses aplikasi lain untuk membaca notifikasi sistem.
1. Buka aplikasi **Notif Forwarder**.
2. Banner di bagian atas akan berwarna oranye bertuliskan **"Permission Required"**.
3. Ketuk banner tersebut untuk langsung menuju ke halaman pengaturan sistem **Akses Notifikasi** Android.
4. Temukan **"Notification Forwarder Service"** (atau **"notif"**) dan aktifkan tombol toggle menjadi **ON / Diizinkan**.
5. Kembali ke aplikasi, banner akan berubah menjadi hijau (**"Notification Access: Enabled & Active"**).

### 2. Konfigurasi Nama Perangkat, Endpoint REST API & Kredensial
1. Buka drawer panel pengaturan di sisi kiri dengan mengusap (*swipe*) dari tepi kiri layar ke kanan atau ketuk ikon menu di pojok kiri atas.
2. Masukkan **Device Name** (contoh: `HP Kasir 1`, `HP Admin`) untuk melacak asal pengirim notifikasi di dasbor.
3. Masukkan **API Base URL** Anda (contoh: `https://api.domain.com`).
4. Masukkan **Endpoint** target (bawaannya adalah `/api/notification`).
5. (Opsional) Masukkan **Bearer Token** jika API Anda memerlukan autentikasi keamanan.
6. Ketuk **"Test Connection"** untuk menguji koneksi. Aplikasi akan mengirimkan payload dummy dan menampilkan status HTTP (sukses/gagal).
7. Ketuk **"Save Settings"** untuk menyimpan setelan tersebut.

### 3. Nonaktifkan Optimasi Baterai (Mencegah Aplikasi Mati Sendiri)
Android memiliki manajemen baterai yang agresif (*Doze mode*) yang dapat menonaktifkan service latar belakang jika perangkat dalam keadaan diam (idle). Agar aplikasi dapat memantau secara terus-menerus:
1. Buka **Setelan (Settings)** perangkat Android Anda.
2. Masuk ke menu **Aplikasi / Manajemen Aplikasi**.
3. Temukan dan ketuk **"Notif Forwarder"** (atau **"notif"**) .
4. Pilih **Baterai / Penggunaan Baterai**.
5. Ubah setelan dari *Dioptimalkan (Optimized)* menjadi **Tidak Dibatasi (Unrestricted)**.
6. (*Khusus perangkat Xiaomi, Oppo, Vivo, OnePlus*): Buka menu recent apps, ketuk dan tahan aplikasi Notif Forwarder lalu pilih ikon gembok (*lock*) agar aplikasi tidak dibersihkan oleh sistem manajemen memori, dan aktifkan izin **Mulai Otomatis (Autostart)** jika tersedia.

---

## 📂 Struktur File Utama

*   **[lib/main.dart](file:///D:/Code/saas/notif/FE-MobileApp/lib/main.dart)**: Titik masuk utama aplikasi & konfigurasi tema Material 3 Dark.
*   **[lib/screens/home_screen.dart](file:///D:/Code/saas/notif/FE-MobileApp/lib/screens/home_screen.dart)**: Log notifikasi, status pengiriman, banner perizinan, dan panel konfigurasi API.
*   **[lib/screens/app_selector_screen.dart](file:///D:/Code/saas/notif/FE-MobileApp/lib/screens/app_selector_screen.dart)**: Halaman pemilih aplikasi terinstal dengan fitur pencarian.
*   **[lib/services/notification_service.dart](file:///D:/Code/saas/notif/FE-MobileApp/lib/services/notification_service.dart)**: Jembatan `MethodChannel` native, deduplikasi, dan logika antrean retry.
*   **[lib/services/api_service.dart](file:///D:/Code/saas/notif/FE-MobileApp/lib/services/api_service.dart)**: Service HTTP klien untuk test koneksi dan forwarding payload JSON.
*   **[lib/models/notification_payload.dart](file:///D:/Code/saas/notif/FE-MobileApp/lib/models/notification_payload.dart)**: Skema log lokal, model JSON, serta regex mengekstrak nominal.
*   **[lib/utils/preferences.dart](file:///D:/Code/saas/notif/FE-MobileApp/lib/utils/preferences.dart)**: Helper penyimpanan persistent dengan `shared_preferences`.
*   **[android/app/src/main/kotlin/com/example/notif/NotifListenerService.kt](file:///D:/Code/saas/notif/FE-MobileApp/android/app/src/main/kotlin/com/example/notif/NotifListenerService.kt)**: Service latar belakang native Android yang menyaring package & merelai event notifikasi.
*   **[android/app/src/main/kotlin/com/example/notif/MainActivity.kt](file:///D:/Code/saas/notif/FE-MobileApp/android/app/src/main/kotlin/com/example/notif/MainActivity.kt)**: Mengatur method channel native dan mendaftarkan engine Flutter ke cache.
