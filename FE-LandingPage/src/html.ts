import { cssContent } from './css';
import { jsContent } from './js';

export function getHtml(githubRepoUrl: string): string {
  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NotifGateway — Hubungkan Notifikasi Pembayaran Android ke Sistem Anda</title>
  <meta name="description" content="Forwarder notifikasi Android premium untuk meneruskan notifikasi e-wallet & perbankan secara real-time ke REST API, Telegram, dan WhatsApp.">
  
  <!-- SEO Meta Tags -->
  <meta property="og:title" content="NotifGateway — Hubungkan Notifikasi Pembayaran Android ke Sistem Anda">
  <meta property="og:description" content="Forwarder notifikasi Android premium untuk meneruskan notifikasi e-wallet & perbankan secara real-time ke REST API, Telegram, dan WhatsApp.">
  <meta property="og:type" content="website">
  
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@700;800&display=swap" rel="stylesheet">
  
  <!-- FontAwesome Icons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  
  <!-- Custom Styling -->
  <style>
    ${cssContent}
  </style>
</head>
<body>

  <!-- Header & Navigation -->
  <header>
    <div class="nav-container">
      <a href="#" class="logo">
        <div class="logo-icon">
          <i class="fas fa-bell"></i>
        </div>
        NotifGateway
      </a>
      
      <button class="menu-btn" id="menu-btn" aria-label="Toggle Menu">
        <i class="fas fa-bars"></i>
      </button>
      
      <nav>
        <ul>
          <li><a href="#fitur"><i class="fas fa-cube"></i> Fitur</a></li>
          <li><a href="#playground"><i class="fas fa-code"></i> Payload</a></li>
          <li><a href="#setup"><i class="fas fa-cog"></i> Panduan</a></li>
          <li><a href="${githubRepoUrl}" target="_blank"><i class="fab fa-github"></i> Repository</a></li>
          <li><a href="/download" class="nav-cta"><i class="fas fa-download"></i> Unduh APK</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="hero">
    <div class="hero-content">
      <span class="hero-tag">Android Forwarder Engine</span>
      <h1 class="hero-title">Notifikasi Pembayaran Instan, Real-Time.</h1>
      <p class="hero-description">
        Mencegat (*intercept*) notifikasi finansial dari e-wallet (GoPay, ShopeePay, OVO, QRIS) & aplikasi perbankan di HP Android, lalu meneruskannya secara otomatis ke REST API Webhook, Telegram, dan WhatsApp.
      </p>
      <div class="hero-actions">
        <a href="/download" class="btn btn-primary"><i class="fas fa-download"></i> Download APK Rilis</a>
        <a href="#fitur" class="btn btn-secondary">Pelajari Fitur</a>
      </div>
    </div>
    
    <div class="hero-mockup">
      <!-- Phone Mockup Container -->
      <div class="phone">
        <div class="phone-screen">
          <div class="phone-header">
            <span>19:30</span>
            <div style="display: flex; gap: 0.35rem; align-items: center;">
              <i class="fas fa-wifi"></i>
              <i class="fas fa-battery-three-quarters"></i>
            </div>
          </div>
          <div class="phone-title">
            <i class="fas fa-dot-circle" style="color: #10b981; font-size: 0.65rem;"></i> Active Listener
          </div>
          <div style="height: 1rem;"></div>
          <div class="phone-logs" id="phone-logs">
            <!-- Simulated notifications injected here by JS -->
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Features Section (Bento Grid) -->
  <section class="features-section" id="fitur">
    <div class="section-header">
      <span class="section-tag">Keunggulan Utama</span>
      <h2 class="section-title">Mengapa Memilih NotifGateway?</h2>
      <p class="section-subtitle">Didukung oleh arsitektur native Android tingkat rendah untuk memastikan keandalan penerusan data 24/7.</p>
    </div>
    
    <div class="bento-grid">
      <!-- 1. Native Listener -->
      <div class="bento-card">
        <div class="card-icon"><i class="fas fa-shield-alt"></i></div>
        <h3 class="card-title">Native Android Service</h3>
        <p class="card-desc">Menggunakan <code>NotificationListenerService</code> kustom di lapisan Kotlin untuk menangkap notifikasi sistem secara instan bahkan ketika layar HP mati.</p>
      </div>
      
      <!-- 2. Multi-channel -->
      <div class="bento-card">
        <div class="card-icon"><i class="fas fa-share-alt"></i></div>
        <h3 class="card-title">Penerusan Multi-Saluran</h3>
        <p class="card-desc">Kirim muatan (*payload*) notifikasi ke webhook REST API internal, WhatsApp Cloud API, dan bot Telegram secara paralel dan bersamaan.</p>
      </div>

      <!-- 3. Deduplication -->
      <div class="bento-card">
        <div class="card-icon"><i class="fas fa-copy"></i></div>
        <h3 class="card-title">Deduplikasi Cerdas</h3>
        <p class="card-desc">Mencegah pengiriman notifikasi duplikat menggunakan kunci compound unik <code>packageName:notifId:text</code>, menjaga data webhook Anda tetap bersih.</p>
      </div>
      
      <!-- 4. Regex Parser (Large) -->
      <div class="bento-card large">
        <div style="display: flex; gap: 1.5rem; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 200px; display: flex; flex-direction: column; gap: 1rem;">
            <div class="card-icon"><i class="fas fa-search-dollar"></i></div>
            <h3 class="card-title">Ekstraksi Nominal Otomatis</h3>
            <p class="card-desc">Parser regex bawaan yang canggih secara otomatis memindai, mendeteksi, dan mengekstrak nominal keuangan (seperti Rp150.000 atau IDR 50.000) dari teks notifikasi masuk untuk mempermudah mutasi otomatis.</p>
          </div>
          <div style="flex: 1; min-width: 200px; background: rgba(0,0,0,0.3); border-radius: 0.75rem; padding: 1rem; font-family: monospace; font-size: 0.8rem; display: flex; flex-direction: column; gap: 0.5rem; border: 1px solid var(--border-color);">
            <div style="color: var(--text-secondary);">Input Teks Notifikasi:</div>
            <div style="color: white; border-left: 2px solid var(--primary); padding-left: 0.5rem;">"QRIS Nobu Rp125.000 berhasil diterima"</div>
            <div style="color: var(--text-secondary); margin-top: 0.5rem;">Hasil Ekstraksi JSON:</div>
            <div style="color: #34d399;">"nominal": 125000</div>
          </div>
        </div>
      </div>
      
      <!-- 5. Reliable Outbox & Retry -->
      <div class="bento-card">
        <div class="card-icon"><i class="fas fa-redo"></i></div>
        <h3 class="card-title">Antrean Offline & Retry</h3>
        <p class="card-desc">Strategi penanganan kegagalan dengan batas waktu respons 10 detik, setelan jumlah percobaan ulang kustom, serta tombol kirim ulang manual di dalam log.</p>
      </div>
    </div>
  </section>

  <!-- Playground Section -->
  <section class="playground-section" id="playground">
    <div class="playground-container">
      <div class="playground-content">
        <span class="hero-tag" style="align-self: flex-start;">Integrasi Pengembang</span>
        <h2 class="section-title" style="font-size: 2.25rem;">Struktur Payload Bersih & Terstandarisasi</h2>
        <p class="section-subtitle">Lihat bagaimana NotifGateway mengemas data notifikasi Android Anda menjadi muatan JSON siap pakai untuk sistem backend Anda.</p>
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <div style="display: flex; gap: 0.75rem; align-items: center;">
            <i class="fas fa-check-circle" style="color: #10b981;"></i>
            <span>Mendukung Kustom Header Bearer Token.</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: center;">
            <i class="fas fa-check-circle" style="color: #10b981;"></i>
            <span>Metadata nama perangkat untuk multi-kasir.</span>
          </div>
          <div style="display: flex; gap: 0.75rem; align-items: center;">
            <i class="fas fa-check-circle" style="color: #10b981;"></i>
            <span>Format Waktu Terstandar ISO 8601 UTC.</span>
          </div>
        </div>
      </div>
      
      <!-- Code Playground -->
      <div class="playground-code">
        <div class="code-header">
          <div class="code-dots">
            <span class="code-dot dot-red"></span>
            <span class="code-dot dot-yellow"></span>
            <span class="code-dot dot-green"></span>
          </div>
          <ul class="code-tabs">
            <li class="code-tab active" data-type="api">REST API</li>
            <li class="code-tab" data-type="telegram">Telegram Bot</li>
            <li class="code-tab" data-type="whatsapp">WhatsApp</li>
          </ul>
        </div>
        <pre class="code-body" id="code-display">{
  <span class="json-key">"source_app"</span>: <span class="json-string">"id.co.bri.merchant"</span>,
  <span class="json-key">"source_app_label"</span>: <span class="json-string">"BRImerchant"</span>,
  <span class="json-key">"device_name"</span>: <span class="json-string">"HP Kasir Utama"</span>,
  <span class="json-key">"title"</span>: <span class="json-string">"Pembayaran Diterima"</span>,
  <span class="json-key">"text"</span>: <span class="json-string">"QRIS Rp150.000 berhasil"</span>,
  <span class="json-key">"big_text"</span>: <span class="json-string">"Pembayaran QRIS sebesar Rp150.000 berhasil diterima"</span>,
  <span class="json-key">"received_at"</span>: <span class="json-string">"2026-06-16T19:30:00Z"</span>,
  <span class="json-key">"notif_id"</span>: <span class="json-number">12345</span>
}</pre>
        <div style="background: rgba(255,255,255,0.01); border-top: 1px solid var(--border-color); padding: 0.5rem 1rem; font-size: 0.75rem; text-align: right; color: var(--text-secondary);">
          Content-Type: application/json
        </div>
      </div>
    </div>
  </section>

  <!-- Setup Guide Section -->
  <section class="guide-section" id="setup">
    <div class="section-header">
      <span class="section-tag">Cara Memulai</span>
      <h2 class="section-title">Langkah Setelan Cepat & Izin</h2>
      <p class="section-subtitle">Tiga langkah penting untuk memastikan kelancaran operasional 24/7 di sistem operasi Android.</p>
    </div>
    
    <div class="accordion">
      <!-- Langkah 1 -->
      <div class="accordion-item active">
        <div class="accordion-header">
          <span>1. Aktifkan Akses Notifikasi Android</span>
          <i class="fas fa-chevron-down accordion-icon"></i>
        </div>
        <div class="accordion-content">
          <p style="margin-bottom: 0.75rem;">Android membatasi pembacaan notifikasi pihak ketiga secara ketat demi keamanan. Anda wajib mengizinkannya secara manual:</p>
          <ul class="guide-step-list">
            <li>Buka aplikasi <strong>NotifGateway</strong> di ponsel Anda.</li>
            <li>Ketuk spanduk jingga bertuliskan <strong>"Permission Required"</strong> di bagian atas layar.</li>
            <li>Temukan aplikasi <strong>"NotifGateway"</strong> pada daftar akses notifikasi sistem Android.</li>
            <li>Geser sakelar toggle menjadi <strong>Aktif / ON</strong>.</li>
          </ul>
        </div>
      </div>
      
      <!-- Langkah 2 -->
      <div class="accordion-item">
        <div class="accordion-header">
          <span>2. Konfigurasi Saluran & Pengaturan Target</span>
          <i class="fas fa-chevron-down accordion-icon"></i>
        </div>
        <div class="accordion-content">
          <p style="margin-bottom: 0.75rem;">Tentukan ke mana saja data notifikasi Anda akan dikirimkan:</p>
          <ul class="guide-step-list">
            <li>Buka drawer navigasi sebelah kiri, masukkan <strong>Device Name</strong> kustom Anda.</li>
            <li>Masuk ke menu <strong>Forwarding Channels</strong>, ketuk tambah (+).</li>
            <li>Pilih jenis saluran (REST API, Telegram, atau WhatsApp) dan isi parameternya (Token Bot, Chat ID, URL, dll).</li>
            <li>Gunakan tombol <strong>"Test Connection"</strong> untuk memverifikasi kecocokan parameter sebelum disimpan.</li>
          </ul>
        </div>
      </div>

      <!-- Langkah 3 -->
      <div class="accordion-item">
        <div class="accordion-header">
          <span>3. Matikan Optimasi Baterai (Mencegah Layanan Mati)</span>
          <i class="fas fa-chevron-down accordion-icon"></i>
        </div>
        <div class="accordion-content">
          <p style="margin-bottom: 0.75rem;">Sistem manajemen daya Android agresif yang dapat mematikan tugas latar belakang:</p>
          <ul class="guide-step-list">
            <li>Buka <strong>Setelan</strong> ponsel Android Anda → pilih menu <strong>Aplikasi</strong>.</li>
            <li>Temukan aplikasi <strong>NotifGateway</strong>, ketuk bagian <strong>Baterai / Hemat Daya</strong>.</li>
            <li>Ubah konfigurasinya menjadi <strong>Tidak Dibatasi / Unrestricted</strong>.</li>
            <li>Gembok aplikasi di panel Recent Apps jika ponsel Anda memilikinya (Xiaomi/Oppo/Vivo).</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA Banner -->
  <section class="cta-section">
    <div class="cta-banner">
      <h2 class="cta-title">Siap Mengotomatiskan Pembayaran Anda?</h2>
      <p class="cta-desc">Unduh berkas APK sekarang secara gratis dan sambungkan mesin kasir Anda langsung ke sistem webhook internal.</p>
      <a href="/download" class="btn btn-primary"><i class="fas fa-download"></i> Unduh APK Sekarang</a>
    </div>
  </section>

  <!-- Footer -->
  <footer>
    <div class="footer-container">
      <div class="footer-top">
        <div class="footer-brand">
          <a href="#" class="logo" style="margin-bottom: 0.5rem;">
            <div class="logo-icon">
              <i class="fas fa-bell"></i>
            </div>
            NotifGateway
          </a>
          <p class="footer-desc">Solusi termudah menjembatani notifikasi HP Android langsung ke backend transaksi bisnis secara real-time.</p>
        </div>
        
        <div class="footer-links">
          <div class="footer-col">
            <span class="footer-col-title">Produk</span>
            <ul>
              <li><a href="#fitur">Fitur Utama</a></li>
              <li><a href="#playground">Payload API</a></li>
              <li><a href="#setup">Panduan Izin</a></li>
            </ul>
          </div>
          
          <div class="footer-col">
            <span class="footer-col-title">Sumber Daya</span>
            <ul>
              <li><a href="${githubRepoUrl}" target="_blank"><i class="fab fa-github"></i> GitHub Repo</a></li>
              <li><a href="${githubRepoUrl}/issues" target="_blank">Laporkan Bug</a></li>
              <li><a href="${githubRepoUrl}/releases" target="_blank">Semua Versi APK</a></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <span>© 2026 NotifGateway by PedagangPulsa. Semua Hak Dilindungi.</span>
        <span>Terintegrasi dengan Cloudflare Edge Network.</span>
      </div>
    </div>
  </footer>

  <!-- Interactivity Script -->
  <script>
    ${jsContent}
  </script>
</body>
</html>`;
}
