# Notification Forwarder (FE-MobileApp)

Aplikasi Flutter Android premium yang dirancang untuk mendengarkan (intercept) notifikasi dari aplikasi terpilih secara real-time dan meneruskannya (*forwarding*) ke berbagai saluran (channels) seperti REST API, Telegram, dan WhatsApp. Sangat ideal untuk integrasi dengan sistem transaksi SaaS, payment gateway (QRIS/Mutasi Bank), atau perutean order otomatis.

---

## 🚀 Fitur Utama

1. **App Selector Interface**: Antarmuka bagi pengguna untuk mencari, memfilter, dan memilih beberapa aplikasi terinstal secara bersamaan untuk dipantau.
2. **Native Notification Interceptor**: Menggunakan layanan kustom Android `NotificationListenerService` di latar belakang untuk menangkap notifikasi sistem secara real-time.
3. **Queueing Strategy**: Menyimpan notifikasi yang masuk ketika engine/antarmuka Flutter sedang tidak aktif dalam antrean Kotlin, lalu mengirimkannya kembali (*flush*) secara otomatis setelah Flutter aktif.
4. **Multi-Channel Forwarding**: Mendukung penerusan notifikasi ke beberapa target sekaligus:
   *   **REST API**: HTTP POST request dengan kustom header bearer token.
   *   **Telegram Bot**: Pengiriman langsung ke chat ID tertentu menggunakan bot token.
   *   **WhatsApp Cloud API**: Pengiriman pesan melalui API resmi WhatsApp (Facebook Graph API).
5. **Deduplikasi Cerdas**: Menggunakan *compound key* (`packageName:notifId:text`) untuk mencegah pengiriman ulang notifikasi yang identik ke saluran target.
6. **Regex Amount Parser**: Secara otomatis mengekstrak nilai nominal finansial (misalnya: `Rp150.000` atau `IDR 50.000`) dari isi teks notifikasi untuk kebutuhan pemantauan transaksi cepat.
7. **Log Detail & Diagnostik Lengkap**: Setiap pengiriman gagal atau percobaan ulang (*retry*) mencatat informasi detail diagnostik secara real-time ke dalam log aplikasi, mencakup:
   *   **Target URL**: Alamat endpoint/API yang dituju.
   *   **Respons Server**: Kode status HTTP dan isi body response (atau pesan error exception jika gagal koneksi).
8. **Configurable & Manual Retry**: Dilengkapi batas waktu respons 10 detik, setelan jumlah percobaan ulang (Max Retries) serta jeda waktu (Delay) yang dapat disesuaikan di drawer pengaturan, dan tombol "Retry Forwarding" untuk mengirim ulang notifikasi yang gagal secara manual.
9. **Connection Tester**: Fitur pengujian saluran target menggunakan dummy payload secara langsung dari halaman konfigurasi saluran dengan penanganan error respons yang informatif (menampilkan deskripsi error Telegram/WhatsApp spesifik jika terjadi kesalahan).

---

## 🛠️ Tech Stack & Dependensi

*   **Flutter 3.x** & **Dart** (App Frontend & Logika Pengiriman)
*   **Kotlin** (Android native service layer)
*   **`shared_preferences`** (Penyimpanan konfigurasi lokal & logs)
*   **`installed_apps`** (Listing & querying aplikasi terinstal)
*   **`http`** (Integrasi REST API client & HTTP requests)

---

## 📦 Format Payload API

Aplikasi mengirimkan permintaan `POST` ke URL REST API yang dikonfigurasi dengan struktur JSON seperti berikut:

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

*   **Header Autentikasi**: Opsional `Authorization: Bearer <token>` akan dikirim jika dikonfigurasi pada setelan saluran target.
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

### 2. Konfigurasi Nama Perangkat & Saluran Pengiriman (Forwarding Channels)
1. Buka drawer panel pengaturan di sisi kiri dengan mengusap (*swipe*) dari tepi kiri layar ke kanan atau ketuk ikon menu di pojok kiri atas.
2. Masukkan **Device Name** (contoh: `HP Kasir 1`, `HP Admin`) untuk melacak asal pengirim notifikasi.
3. Masuk ke menu **Forwarding Channels** (Saluran Pengiriman) untuk menambahkan target pengiriman baru:
   *   **REST API**: Masukkan API URL, Endpoint, dan Token Autentikasi.
   *   **Telegram**: Masukkan Bot Token dan Chat ID target.
   *   **WhatsApp**: Masukkan Phone Number ID, Access Token, dan nomor penerima.
4. Gunakan tombol **"Test Connection"** untuk memvalidasi konfigurasi Anda. Jika terdapat kesalahan (seperti error 400 karena Chat ID tidak ditemukan di Telegram), detail respons error dari API akan ditampilkan untuk mempermudah perbaikan.
5. Simpan pengaturan saluran target dan pastikan status saluran telah aktif (**Enabled**).

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

*   **[lib/main.dart](lib/main.dart)**: Titik masuk utama aplikasi & konfigurasi tema Material 3 Dark.
*   **[lib/screens/home_screen.dart](lib/screens/home_screen.dart)**: Log notifikasi, status pengiriman, banner perizinan, dan drawer pengaturan global.
*   **[lib/screens/forward_targets_screen.dart](lib/screens/forward_targets_screen.dart)**: Halaman daftar saluran forwarding target.
*   **[lib/screens/edit_target_screen.dart](lib/screens/edit_target_screen.dart)**: Halaman untuk menambah/mengedit konfigurasi saluran target (API, Telegram, WhatsApp) dan tombol Test Connection.
*   **[lib/screens/app_selector_screen.dart](lib/screens/app_selector_screen.dart)**: Halaman pemilih aplikasi terinstal dengan fitur pencarian.
*   **[lib/services/notification_service.dart](lib/services/notification_service.dart)**: Jembatan `MethodChannel` native, deduplikasi, dan logika retry dengan log detail.
*   **[lib/services/api_service.dart](lib/services/api_service.dart)**: Service HTTP klien untuk test koneksi dan forwarding payload ke berbagai target.
*   **[lib/models/notification_payload.dart](lib/models/notification_payload.dart)**: Skema log lokal, model JSON, serta regex mengekstrak nominal.
*   **[lib/models/forward_target.dart](lib/models/forward_target.dart)**: Skema model target forwarding (API, Telegram, WhatsApp).
*   **[lib/utils/preferences.dart](lib/utils/preferences.dart)**: Helper penyimpanan persistent dengan `shared_preferences`.
*   **[android/app/src/main/kotlin/com/example/notif/NotifListenerService.kt](android/app/src/main/kotlin/com/example/notif/NotifListenerService.kt)**: Service latar belakang native Android yang menyaring package & merelai event notifikasi.
*   **[android/app/src/main/kotlin/com/example/notif/MainActivity.kt](android/app/src/main/kotlin/com/example/notif/MainActivity.kt)**: Mengatur method channel native dan mendaftarkan engine Flutter ke cache.

---

## 🛠️ Pengembangan & Build Rilis

### 1. Build Lokal
Untuk menjalankan atau membangun aplikasi secara lokal, pastikan Anda telah menginstal Flutter SDK dan ikuti perintah di bawah ini:
```bash
# Mengunduh dependensi
flutter pub get

# Menjalankan aplikasi dalam mode debug
flutter run

# Membangun berkas APK rilis
flutter build apk --release
```

### 2. Konfigurasi Penandatanganan Aplikasi (App Signing)
Sebelum merilis APK ke produksi, buat file `android/key.properties` berdasarkan contoh di `android/key.properties.example` dan tentukan keystore Anda di sana.
Untuk mengotomatiskan penyiapan ini dalam CI/CD:
1. Jalankan skrip pembantu PowerShell di `android/encode_keystore.ps1` untuk mengonversi berkas keystore Anda (`upload-keystore.jks`) menjadi format Base64.
2. Salin string Base64 yang dihasilkan dari berkas `upload-keystore.jks.base64`.
3. Simpan di GitHub Secrets repositori Anda dengan nama `ANDROID_KEYSTORE_BASE64`.
4. Simpan isi konten konfigurasi kunci Anda di GitHub Secrets dengan nama `KEY_PROPERTIES`.

### 3. Alur Kerja CI/CD (GitHub Actions)
Repositori ini dilengkapi dengan alur kerja GitHub Actions otomatis (`.github/workflows/release.yml`) untuk membangun rilis APK secara otomatis:
* **Pemicu (Trigger)**: Dorong/push tag Git baru yang diawali dengan huruf `v` (misalnya: `v1.0.0`, `v0.0.2-beta`).
* **Hasil Akhir**: Sistem akan secara otomatis mengompilasi aplikasi ke dalam APK produksi bertanda tangan (`app-release.apk`) dan mengunggahnya langsung sebagai aset rilis baru di GitHub Release.

