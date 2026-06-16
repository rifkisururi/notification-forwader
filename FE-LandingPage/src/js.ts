export const jsContent = `
document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const menuBtn = document.getElementById('menu-btn');
  const nav = document.querySelector('nav');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      nav.classList.toggle('active');
      const icon = menuBtn.querySelector('i');
      if (icon) {
        if (nav.classList.contains('active')) {
          icon.className = 'fas fa-times';
        } else {
          icon.className = 'fas fa-bars';
        }
      }
    });
  }

  // Accordion Logic
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');
      
      // Close all accordion items
      document.querySelectorAll('.accordion-item').forEach(i => {
        i.classList.remove('active');
      });
      
      // Toggle current
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // Playground JSON Data
  const jsonPayloads = {
    api: \`{
  <span class="json-key">"source_app"</span>: <span class="json-string">"id.co.bri.merchant"</span>,
  <span class="json-key">"source_app_label"</span>: <span class="json-string">"BRImerchant"</span>,
  <span class="json-key">"device_name"</span>: <span class="json-string">"HP Kasir Utama"</span>,
  <span class="json-key">"title"</span>: <span class="json-string">"Pembayaran Diterima"</span>,
  <span class="json-key">"text"</span>: <span class="json-string">"QRIS Rp150.000 berhasil"</span>,
  <span class="json-key">"big_text"</span>: <span class="json-string">"Pembayaran QRIS sebesar Rp150.000 berhasil diterima"</span>,
  <span class="json-key">"received_at"</span>: <span class="json-string">"2026-06-16T19:30:00Z"</span>,
  <span class="json-key">"notif_id"</span>: <span class="json-number">12345</span>
}\`,
    telegram: \`{
  <span class="json-key">"chat_id"</span>: <span class="json-string">"-100123456789"</span>,
  <span class="json-key">"text"</span>: <span class="json-string">"🔔 <b>Notifikasi Baru [HP Kasir Utama]</b>\\n\\nApp: <b>BRImerchant</b>\\nJudul: Pembayaran Diterima\\nTeks: QRIS Rp150.000 berhasil\\nNominal: <b>Rp 150.000</b>\\nWaktu: 2026-06-16 19:30"</span>,
  <span class="json-key">"parse_mode"</span>: <span class="json-string">"HTML"</span>
}\`,
    whatsapp: \`{
  <span class="json-key">"messaging_product"</span>: <span class="json-string">"whatsapp"</span>,
  <span class="json-key">"to"</span>: <span class="json-string">"6281234567890"</span>,
  <span class="json-key">"type"</span>: <span class="json-string">"template"</span>,
  <span class="json-key">"template"</span>: {
    <span class="json-key">"name"</span>: <span class="json-string">"notification_alert"</span>,
    <span class="json-key">"language"</span>: {
      <span class="json-key">"code"</span>: <span class="json-string">"id"</span>
    },
    <span class="json-key">"components"</span>: [
      {
        <span class="json-key">"type"</span>: <span class="json-string">"body"</span>,
        <span class="json-key">"parameters"</span>: [
          { <span class="json-key">"type"</span>: <span class="json-string">"text"</span>, <span class="json-key">"text"</span>: <span class="json-string">"HP Kasir Utama"</span> },
          { <span class="json-key">"type"</span>: <span class="json-string">"text"</span>, <span class="json-key">"text"</span>: <span class="json-string">"BRImerchant"</span> },
          { <span class="json-key">"type"</span>: <span class="json-string">"text"</span>, <span class="json-key">"text"</span>: <span class="json-string">"QRIS Rp150.000 berhasil"</span> },
          { <span class="json-key">"type"</span>: <span class="json-string">"text"</span>, <span class="json-key">"text"</span>: <span class="json-string">"Rp150.000"</span> }
        ]
      }
    ]
  }
}\`
  };

  const codeTabs = document.querySelectorAll('.code-tab');
  const codeDisplay = document.getElementById('code-display');
  
  if (codeDisplay) {
    codeTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        codeTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        const type = tab.getAttribute('data-type');
        if (type && type in jsonPayloads) {
          codeDisplay.innerHTML = jsonPayloads[type as keyof typeof jsonPayloads];
        }
      });
    });
  }

  // Simulated Phone Notifications
  const phoneLogs = document.getElementById('phone-logs');
  const notifications = [
    {
      app: 'GoPay',
      appIcon: 'fa-wallet',
      title: 'Transfer Masuk',
      body: 'Anda menerima transfer sebesar Rp50.000 dari BUDI UTOMO',
      nominal: 'Rp50.000',
      channels: ['REST API', 'Telegram']
    },
    {
      app: 'ShopeePay',
      appIcon: 'fa-shopping-bag',
      title: 'QRIS Berhasil',
      body: 'Dana QRIS Rp125.500 telah masuk ke saldo merchant Anda',
      nominal: 'Rp125.500',
      channels: ['REST API', 'WhatsApp']
    },
    {
      app: 'BRImerchant',
      appIcon: 'fa-university',
      title: 'Pembayaran Sukses',
      body: 'Pembayaran QRIS Rp200.000 berhasil diterima oleh Kasir 1',
      nominal: 'Rp200.000',
      channels: ['REST API', 'Telegram', 'WhatsApp']
    },
    {
      app: 'OVO',
      appIcon: 'fa-coins',
      title: 'Top Up Merchant',
      body: 'Transaksi OVO QRIS Rp75.000 sukses dikreditkan',
      nominal: 'Rp75.000',
      channels: ['REST API']
    }
  ];

  let notifIndex = 0;

  function pushNotification() {
    if (!phoneLogs) return;

    // Remove oldest notification if we have too many
    if (phoneLogs.children.length >= 3) {
      const firstChild = phoneLogs.children[0];
      firstChild.style.animation = 'slideOutNotif 0.4s ease forwards';
      setTimeout(() => {
        firstChild.remove();
      }, 400);
    }

    const item = notifications[notifIndex];
    notifIndex = (notifIndex + 1) % notifications.length;

    // Create element
    const notifEl = document.createElement('div');
    notifEl.className = 'mock-notif';
    notifEl.innerHTML = \`
      <div class="mock-notif-header">
        <div class="mock-notif-app">
          <div class="mock-notif-icon"><i class="fas \${item.appIcon}"></i></div>
          \${item.app}
        </div>
        <span class="mock-notif-time">Baru saja</span>
      </div>
      <div class="mock-notif-title">\${item.title}</div>
      <div class="mock-notif-body">\${item.body}</div>
      <div class="mock-notif-footer">
        <span class="mock-notif-nominal">\${item.nominal}</span>
        <span class="mock-status status-sending"><i class="fas fa-spinner fa-spin"></i> Memproses</span>
      </div>
    \`;

    phoneLogs.appendChild(notifEl);

    // Simulate forward status after 1.5s
    setTimeout(() => {
      const statusEl = notifEl.querySelector('.mock-status');
      if (statusEl) {
        statusEl.className = 'mock-status status-sent';
        statusEl.innerHTML = \`<i class="fas fa-check-circle"></i> Terkirim\`;
        
        // Add dynamic mini log detailing channels
        const channelsText = item.channels.join(', ');
        const logDetail = document.createElement('div');
        logDetail.style.fontSize = '0.62rem';
        logDetail.style.color = '#818cf8';
        logDetail.style.marginTop = '0.2rem';
        logDetail.style.borderTop = '1px dashed rgba(255,255,255,0.05)';
        logDetail.style.paddingTop = '0.2rem';
        logDetail.innerHTML = \`Relay: <strong>\${channelsText}</strong>\`;
        notifEl.appendChild(logDetail);
      }
    }, 1500);
  }

  // Inject dynamic slideOut animation styles
  const style = document.createElement('style');
  style.innerHTML = \`
    @keyframes slideOutNotif {
      to {
        opacity: 0;
        transform: translateY(-20px) scale(0.95);
        margin-top: -80px;
      }
    }
  \`;
  document.head.appendChild(style);

  // Run simulation loop
  pushNotification();
  setInterval(pushNotification, 4000);
});
`;
