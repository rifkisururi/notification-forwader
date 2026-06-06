export const loginHtml = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login — Notification Center</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preload" href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet"></noscript>
  <style>
    :root {
      --bg-color: #0b0f19;
      --card-bg: rgba(20, 26, 46, 0.6);
      --card-border: rgba(255, 255, 255, 0.08);
      --text-main: #f3f4f6;
      --text-muted: #b0b7c3;
      --primary: #6366f1;
      --primary-hover: #4f46e5;
      --primary-glow: rgba(99, 102, 241, 0.15);
      --error: #ef4444;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Outfit', sans-serif;
      background-color: var(--bg-color);
      color: var(--text-main);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow-x: hidden;
      position: relative;
    }

    /* Ambient Background Glows */
    body::before, body::after {
      content: '';
      position: absolute;
      width: 400px;
      height: 400px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(0,0,0,0) 70%);
      z-index: -1;
      filter: blur(50px);
    }
    body::before {
      top: -100px;
      left: -100px;
    }
    body::after {
      bottom: -100px;
      right: -100px;
    }

    .container {
      width: 100%;
      max-width: 420px;
      padding: 16px;
      z-index: 1;
    }

    .card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-radius: 24px;
      padding: 40px 32px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
      animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .header {
      text-align: center;
      margin-bottom: 32px;
    }

    .logo-container {
      width: 56px;
      height: 56px;
      background: linear-gradient(135deg, var(--primary) 0%, #a855f7 100%);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
      box-shadow: 0 8px 16px var(--primary-glow);
    }

    .logo-container svg {
      width: 28px;
      height: 28px;
      fill: #fff;
    }

    h1 {
      font-size: 24px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 8px;
      letter-spacing: -0.5px;
    }

    .subtitle {
      font-size: 14px;
      color: var(--text-muted);
    }

    .form-group {
      margin-bottom: 20px;
      position: relative;
    }

    label {
      display: block;
      font-size: 13px;
      font-weight: 500;
      color: var(--text-main);
      margin-bottom: 8px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }

    .input-wrapper {
      position: relative;
    }

    .input-wrapper svg {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      width: 18px;
      height: 18px;
      color: var(--text-muted);
      transition: color 0.3s;
    }

    input {
      width: 100%;
      padding: 12px 16px 12px 44px;
      background: rgba(10, 11, 20, 0.5);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      color: #fff;
      font-family: inherit;
      font-size: 14px;
      transition: all 0.3s;
      outline: none;
    }

    input:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 4px var(--primary-glow);
    }

    input::placeholder {
      color: rgba(176, 183, 195, 0.5);
    }

    input:focus + svg {
      color: var(--primary);
    }

    .password-wrapper {
      position: relative;
    }

    .password-wrapper input {
      padding-right: 44px;
    }

    .password-toggle {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      padding: 4px;
      display: flex;
      align-items: center;
      transition: color 0.2s;
    }

    .password-toggle:hover {
      color: var(--text-main);
    }

    .btn {
      width: 100%;
      padding: 12px;
      background: linear-gradient(135deg, var(--primary) 0%, #4f46e5 100%);
      border: none;
      border-radius: 12px;
      color: #fff;
      font-family: inherit;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      margin-top: 10px;
      box-shadow: 0 4px 12px var(--primary-glow);
    }

    .btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3);
    }

    .btn:active {
      transform: translateY(0);
    }

    .error-msg {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.2);
      border-radius: 12px;
      color: var(--error);
      padding: 12px;
      font-size: 13px;
      margin-bottom: 20px;
      display: none;
      align-items: center;
      gap: 8px;
    }

    .error-msg.visible {
      display: flex;
    }

    .spinner {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      display: none;
      margin: 0 auto;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Mobile Adaptability */
    @media (max-width: 400px) {
      .card {
        padding: 28px 20px;
        border-radius: 20px;
      }
      h1 {
        font-size: 20px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <div class="logo-container">
          <svg viewBox="0 0 24 24">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </div>
        <h1>Notification Center</h1>
        <p class="subtitle">Silakan login sebagai Admin</p>
      </div>

      <div id="errorBox" class="error-msg">
        <svg style="width:16px;height:16px;fill:currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
        <span id="errorText">Username atau password salah.</span>
      </div>

      <form id="loginForm">
        <div class="form-group">
          <label for="username">Username</label>
          <div class="input-wrapper">
            <input type="text" id="username" placeholder="Masukkan username admin" required autocomplete="username" aria-label="Username admin">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <div class="input-wrapper password-wrapper">
            <input type="password" id="password" placeholder="Masukkan password" required autocomplete="current-password" aria-label="Password admin">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <button type="button" class="password-toggle" onclick="togglePassword('password', this)" aria-label="Tampilkan password">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
          </div>
        </div>

        <button type="submit" class="btn" aria-label="Login ke dashboard">
          <span id="btnText">Login</span>
          <div id="btnSpinner" class="spinner"></div>
        </button>
      </form>
    </div>
  </div>

  <script>
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorBox = document.getElementById('errorBox');
    const errorText = document.getElementById('errorText');
    const btnText = document.getElementById('btnText');
    const btnSpinner = document.getElementById('btnSpinner');

    function togglePassword(inputId, btn) {
      const input = document.getElementById(inputId);
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      btn.setAttribute('aria-label', isPassword ? 'Sembunyikan password' : 'Tampilkan password');
    }

    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Reset UI
      errorBox.classList.remove('visible');
      btnText.style.display = 'none';
      btnSpinner.style.display = 'block';

      const username = usernameInput.value;
      const password = passwordInput.value;

      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        
        if (response.ok && data.ok) {
          // Redirect ke dashboard
          window.location.href = '/dashboard';
        } else {
          showError(data.error || 'Username atau password salah.');
        }
      } catch (err) {
        showError('Gagal menghubungkan ke server. Silakan coba lagi.');
      } finally {
        btnText.style.display = 'block';
        btnSpinner.style.display = 'none';
      }
    });

    function showError(message) {
      errorText.textContent = message;
      errorBox.classList.add('visible');
    }
  </script>
</body>
</html>`;

export const dashboardHtml = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard — Notification Center</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preload" href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet"></noscript>
  <style>
    :root {
      --bg-color: #080b11;
      --card-bg: rgba(17, 22, 37, 0.7);
      --card-border: rgba(255, 255, 255, 0.06);
      --sidebar-bg: #0d121f;
      --text-main: #f3f4f6;
      --text-muted: #b0b7c3;
      --primary: #6366f1;
      --primary-hover: #4f46e5;
      --primary-glow: rgba(99, 102, 241, 0.15);
      --success: #10b981;
      --error: #ef4444;
      --warning: #f59e0b;
      --info: #06b6d4;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Outfit', sans-serif;
      background-color: var(--bg-color);
      color: var(--text-main);
      min-height: 100vh;
      display: flex;
      overflow-x: hidden;
    }

    /* Layout */
    .sidebar {
      width: 260px;
      background: var(--sidebar-bg);
      border-right: 1px solid var(--card-border);
      display: flex;
      flex-direction: column;
      height: 100vh;
      position: fixed;
      left: 0;
      top: 0;
      z-index: 10;
      transition: transform 0.3s ease-in-out;
    }

    .sidebar-backdrop {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(4, 6, 12, 0.65);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      display: none;
      z-index: 9;
      animation: fadeIn 0.2s ease-out;
    }

    .main-content {
      flex: 1;
      margin-left: 260px;
      padding: 40px;
      min-height: 100vh;
      transition: all 0.3s;
    }

    /* Sidebar Header */
    .sidebar-header {
      padding: 30px 24px;
      display: flex;
      align-items: center;
      gap: 12px;
      border-bottom: 1px solid var(--card-border);
    }

    .logo {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, var(--primary) 0%, #a855f7 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px var(--primary-glow);
    }

    .logo svg {
      width: 20px;
      height: 20px;
      fill: #fff;
    }

    .logo-text h2 {
      font-size: 16px;
      font-weight: 700;
      color: #fff;
      letter-spacing: -0.3px;
    }

    .logo-text p {
      font-size: 11px;
      color: var(--text-muted);
    }

    /* Sidebar Menu */
    .sidebar-menu {
      padding: 24px 16px;
      flex: 1;
    }

    .menu-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      color: var(--text-muted);
      text-decoration: none;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 6px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .menu-item:hover, .menu-item.active {
      color: #fff;
      background: rgba(255, 255, 255, 0.04);
    }

    .menu-item.active {
      background: var(--primary-glow);
      color: #818cf8;
      border: 1px solid rgba(99, 102, 241, 0.15);
    }

    .menu-item svg {
      width: 18px;
      height: 18px;
    }

    .sidebar-footer {
      padding: 20px;
      border-top: 1px solid var(--card-border);
    }

    /* Header */
    .header-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }

    .header-title h1 {
      font-size: 28px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }

    .header-title p {
      font-size: 14px;
      color: var(--text-muted);
      margin-top: 4px;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .avatar {
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--card-border);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      color: var(--primary);
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }

    .stats-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 20px;
      padding: 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }

    .stats-card-left h3 {
      font-size: 13px;
      color: var(--text-muted);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .stats-card-left .value {
      font-size: 28px;
      font-weight: 700;
      margin-top: 8px;
      color: #fff;
    }

    .stats-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stats-icon svg {
      width: 24px;
      height: 24px;
    }

    .stats-total { background: rgba(99, 102, 241, 0.1); color: var(--primary); }
    .stats-today { background: rgba(6, 182, 212, 0.1); color: var(--info); }
    .stats-success { background: rgba(16, 185, 129, 0.1); color: var(--success); }
    .stats-apps { background: rgba(168, 85, 247, 0.1); color: #a855f7; }

    /* Dashboard Sections */
    .section {
      display: none;
      animation: fadeIn 0.4s ease-out forwards;
    }

    .section.active {
      display: block;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Cards */
    .content-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 24px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.15);
      overflow: hidden;
      margin-bottom: 24px;
    }

    .card-header {
      padding: 24px;
      border-bottom: 1px solid var(--card-border);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
    }

    .card-header h2 {
      font-size: 18px;
      font-weight: 600;
    }

    /* Filters & Controls */
    .table-controls {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      width: 100%;
    }

    .search-wrapper {
      position: relative;
      flex: 1;
      min-width: 200px;
    }

    .search-wrapper svg {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      width: 18px;
      height: 18px;
      color: var(--text-muted);
    }

    .search-input {
      width: 100%;
      padding: 10px 16px 10px 42px;
      background: rgba(10, 11, 20, 0.4);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      color: #fff;
      font-family: inherit;
      outline: none;
      transition: all 0.3s;
    }

    .search-input:focus {
      border-color: var(--primary);
    }

    .select-input {
      padding: 10px 16px;
      background: rgba(10, 11, 20, 0.4);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      color: #fff;
      font-family: inherit;
      outline: none;
      cursor: pointer;
    }

    /* Tables */
    .table-responsive {
      overflow-x: auto;
      width: 100%;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    th {
      padding: 16px 24px;
      font-size: 13px;
      color: var(--text-muted);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1px solid var(--card-border);
    }

    td {
      padding: 16px 24px;
      font-size: 14px;
      border-bottom: 1px solid var(--card-border);
      color: var(--text-main);
    }

    tr:last-child td {
      border-bottom: none;
    }

    tr:hover td {
      background: rgba(255, 255, 255, 0.02);
    }

    .app-badge {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .app-icon-placeholder {
      width: 28px;
      height: 28px;
      border-radius: 8px;
      background: var(--primary-glow);
      color: var(--primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 12px;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      padding: 4px 10px;
      border-radius: 8px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .badge-success { background: rgba(16, 185, 129, 0.1); color: var(--success); }
    .badge-info { background: rgba(6, 182, 212, 0.1); color: var(--info); }
    .badge-failed { background: rgba(239, 68, 68, 0.1); color: var(--error); }

    .nominal-text {
      font-family: monospace;
      font-weight: 600;
      color: var(--info);
    }

    /* Mobile Cards View */
    #notifCardsContainer {
      display: none;
      flex-direction: column;
      gap: 12px;
      padding: 16px;
    }

    .mobile-card {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .mobile-card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
    }

    .mobile-card-time {
      font-size: 11px;
      color: var(--text-muted);
      white-space: nowrap;
    }

    .mobile-card-body {
      font-size: 14px;
    }

    .mobile-card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid rgba(255,255,255,0.04);
      padding-top: 10px;
      margin-top: 4px;
    }

    /* Paging */
    .pagination {
      padding: 20px 24px;
      border-top: 1px solid var(--card-border);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .btn-secondary {
      padding: 8px 16px;
      background: rgba(255,255,255,0.04);
      border: 1px solid var(--card-border);
      border-radius: 10px;
      color: #fff;
      cursor: pointer;
      font-family: inherit;
      font-size: 13px;
      transition: all 0.2s;
    }

    .btn-secondary:hover:not(:disabled) {
      background: rgba(255,255,255,0.08);
    }

    .btn-secondary:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    /* Settings Form */
    .form-card {
      max-width: 600px;
    }

    .form-group {
      margin-bottom: 24px;
    }

    .form-group label {
      display: block;
      font-size: 13px;
      font-weight: 600;
      color: var(--text-muted);
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .form-control {
      width: 100%;
      padding: 12px 16px;
      background: rgba(10, 11, 20, 0.4);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      color: #fff;
      font-family: inherit;
      outline: none;
      transition: border 0.2s;
    }

    .form-control:focus {
      border-color: var(--primary);
    }

    .btn-primary {
      padding: 12px 24px;
      background: linear-gradient(135deg, var(--primary) 0%, #4f46e5 100%);
      border: none;
      border-radius: 12px;
      color: #fff;
      font-family: inherit;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 12px var(--primary-glow);
      transition: all 0.3s;
    }

    .btn-primary:hover {
      box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3);
      transform: translateY(-1px);
    }

    .status-alert {
      padding: 16px;
      border-radius: 12px;
      margin-bottom: 24px;
      display: none;
      font-size: 14px;
    }

    .status-alert.success {
      display: block;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.2);
      color: var(--success);
    }

    .status-alert.error {
      display: block;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.2);
      color: var(--error);
    }

    /* Toggle Switch */
    .switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .slider {
      position: absolute;
      cursor: pointer;
      top: 0; left: 0; right: 0; bottom: 0;
      background-color: rgba(255,255,255,0.06);
      border: 1px solid var(--card-border);
      transition: .3s;
      border-radius: 24px;
    }

    .slider:before {
      position: absolute;
      content: "";
      left: 3px;
      bottom: 3px;
      background-color: #fff;
      transition: .3s;
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }

    input:checked + .slider {
      background-color: var(--primary);
      border-color: rgba(99, 102, 241, 0.3);
    }

    input:checked + .slider:before {
      transform: translateX(20px);
    }

    .integration-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    /* Modal Details */
    .modal-backdrop {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(5, 7, 12, 0.8);
      backdrop-filter: blur(8px);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 100;
      padding: 16px;
    }

    .modal {
      background: var(--sidebar-bg);
      border: 1px solid var(--card-border);
      border-radius: 24px;
      width: 100%;
      max-width: 500px;
      box-shadow: 0 24px 48px rgba(0,0,0,0.5);
      animation: modalFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes modalFadeIn {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }

    .modal-header {
      padding: 24px;
      border-bottom: 1px solid var(--card-border);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-header h3 {
      font-size: 18px;
      font-weight: 600;
    }

    .modal-close {
      background: none;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
    }

    .modal-close svg {
      width: 24px;
      height: 24px;
    }

    .modal-body {
      padding: 24px;
    }

    .detail-item {
      margin-bottom: 16px;
    }

    .detail-item:last-child {
      margin-bottom: 0;
    }

    .detail-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--text-muted);
      font-weight: 600;
      margin-bottom: 4px;
    }

    .detail-value {
      font-size: 14px;
      color: #fff;
      word-break: break-all;
    }

    /* Mobile Responsive Optimizations — Consolidated Breakpoints */
    @media (max-width: 1024px) {
      .sidebar {
        transform: translateX(-100%);
      }
      .sidebar.open {
        transform: translateX(0);
      }
      .main-content {
        margin-left: 0;
        padding: 24px;
      }
      .menu-btn {
        display: flex !important;
      }
    }

    @media (max-width: 640px) {
      .main-content {
        padding: 16px;
      }
      .table-responsive {
        display: none;
      }
      #notifCardsContainer {
        display: flex;
      }
      .header-title h1 {
        font-size: 20px;
      }
      .header-title p {
        display: none;
      }
      .user-info span {
        display: none;
      }
      .stats-grid {
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        margin-bottom: 24px;
      }
      .stats-card {
        padding: 14px;
        gap: 8px;
      }
      .stats-card-left h3 {
        font-size: 11px;
      }
      .stats-card-left .value {
        font-size: 22px;
        margin-top: 4px;
      }
      .stats-icon {
        width: 36px;
        height: 36px;
        border-radius: 8px;
      }
      .stats-icon svg {
        width: 18px;
        height: 18px;
      }
      .table-controls {
        flex-direction: column;
        gap: 10px;
      }
      .search-wrapper {
        width: 100%;
      }
      .select-input {
        width: 100%;
      }
      .card-header {
        padding: 16px;
      }
      .modal {
        border-radius: 16px;
        margin: 8px;
      }
      .modal-body {
        padding: 16px;
      }
      .modal-header {
        padding: 16px;
      }
    }

    .menu-btn {
      display: none;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: rgba(255,255,255,0.04);
      border: 1px solid var(--card-border);
      border-radius: 10px;
      cursor: pointer;
      color: #fff;
    }

    .menu-btn svg {
      width: 20px;
      height: 20px;
    }
    .tab-btn {
      background: none;
      border: 1px solid transparent;
      color: var(--text-muted);
      padding: 6px 12px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      border-radius: 6px;
      transition: all 0.2s ease;
    }
    .tab-btn:hover {
      color: #fff;
      background: rgba(255,255,255,0.04);
    }
    .tab-btn.active {
      background: rgba(255,255,255,0.08) !important;
      border-color: var(--card-border) !important;
      color: #fff !important;
    }

    /* Skip Link */
    .skip-link {
      position: absolute;
      top: -40px;
      left: 0;
      background: var(--primary);
      color: #fff;
      padding: 8px 16px;
      z-index: 9999;
      text-decoration: none;
      font-size: 14px;
      border-radius: 0 0 8px 0;
      transition: top 0.2s;
    }
    .skip-link:focus {
      top: 0;
    }

    /* Placeholder style */
    input::placeholder, .search-input::placeholder, .form-control::placeholder, textarea::placeholder {
      color: rgba(176, 183, 195, 0.5);
    }

    /* Password Toggle */
    .password-wrapper {
      position: relative;
    }
    .password-wrapper input {
      padding-right: 44px;
    }
    .password-toggle {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      padding: 4px;
      display: flex;
      align-items: center;
      transition: color 0.2s;
    }
    .password-toggle:hover {
      color: var(--text-main);
    }

    /* Touch target improvements */
    .btn-sm {
      padding: 8px 14px;
      font-size: 12px;
      border-radius: 8px;
      min-height: 36px;
    }
    .modal-close {
      padding: 8px;
      margin: -8px;
    }
    .switch {
      position: relative;
      display: inline-block;
      width: 48px;
      height: 28px;
    }
    .slider:before {
      height: 20px;
      width: 20px;
    }
    input:checked + .slider:before {
      transform: translateX(20px);
    }

    /* Press feedback */
    .btn-secondary:active:not(:disabled) {
      transform: scale(0.97);
      opacity: 0.85;
    }
    .btn-sm:active {
      transform: scale(0.95);
    }
    .menu-item:active {
      background: rgba(255, 255, 255, 0.06);
    }
    .content-card {
      transition: box-shadow 0.2s, transform 0.2s;
    }
    .content-card:hover {
      box-shadow: 0 12px 40px rgba(0,0,0,0.2);
    }

    /* Stats stagger animation */
    .stats-card {
      animation: fadeIn 0.4s ease-out both;
    }
    .stats-card:nth-child(1) { animation-delay: 0ms; }
    .stats-card:nth-child(2) { animation-delay: 60ms; }
    .stats-card:nth-child(3) { animation-delay: 120ms; }
    .stats-card:nth-child(4) { animation-delay: 180ms; }

    /* Stats "Penyedia App" — purple instead of red */
    .stats-apps { background: rgba(168, 85, 247, 0.1); color: #a855f7; }

    /* Skeleton Loading */
    .skeleton {
      background: linear-gradient(90deg,
        rgba(255,255,255,0.04) 25%,
        rgba(255,255,255,0.08) 50%,
        rgba(255,255,255,0.04) 75%
      );
      background-size: 200% 100%;
      animation: shimmer 1.5s ease-in-out infinite;
      border-radius: 6px;
    }
    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    /* Field error inline */
    .field-error {
      color: var(--error);
      font-size: 12px;
      margin-top: 4px;
      display: block;
    }

    /* Modal exit animation */
    @keyframes modalFadeOut {
      from { transform: scale(1); opacity: 1; }
      to { transform: scale(0.95); opacity: 0; }
    }
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    /* Toast */
    .toast {
      position: fixed;
      bottom: 24px;
      right: 24px;
      padding: 12px 20px;
      border-radius: 12px;
      font-size: 14px;
      z-index: 1000;
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      font-family: 'Outfit', sans-serif;
      animation: slideUp 0.3s ease-out;
      max-width: 360px;
    }
    .toast-success {
      background: rgba(16,185,129,0.15);
      border: 1px solid rgba(16,185,129,0.3);
      color: #34d399;
    }
    .toast-error {
      background: rgba(239,68,68,0.15);
      border: 1px solid rgba(239,68,68,0.3);
      color: #f87171;
    }

    /* Custom Confirm Modal */
    .confirm-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      margin-top: 24px;
    }
    .btn-danger {
      padding: 10px 20px;
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 12px;
      color: #f87171;
      font-family: inherit;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-danger:hover {
      background: rgba(239, 68, 68, 0.25);
    }

    /* Mobile touch improvements */
    @media (max-width: 640px) {
      .btn-sm {
        min-height: 40px;
        padding: 8px 16px;
      }
      #integrationsListContainer {
        grid-template-columns: 1fr;
      }
    }

    /* Prefers reduced motion */
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
  </style>
</head>
<body>

  <a href="#mainContent" class="skip-link">Langsung ke konten utama</a>

  <!-- Sidebar Backdrop (Mobile Drawer Effect) -->
  <div class="sidebar-backdrop" id="sidebarBackdrop" onclick="toggleSidebar()"></div>

  <!-- Sidebar -->
  <aside class="sidebar" id="sidebar">
    <div class="sidebar-header">
      <div class="logo">
        <svg viewBox="0 0 24 24">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      </div>
      <div class="logo-text">
        <h2>Notif Admin</h2>
        <p>Dashboard Panel</p>
      </div>
    </div>
    <div class="sidebar-menu">
      <div class="menu-item active" data-target="dashboardSec" onclick="switchTab(this)" role="button" tabindex="0" aria-label="Dashboard — Overview notifikasi">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="7" height="9"></rect>
          <rect x="14" y="3" width="7" height="5"></rect>
          <rect x="14" y="12" width="7" height="9"></rect>
          <rect x="3" y="16" width="7" height="5"></rect>
        </svg>
        <span>Dashboard</span>
      </div>
      <div class="menu-item" data-target="forwardingSec" onclick="switchTab(this)" role="button" tabindex="0" aria-label="Forwarding — Integrasi notifikasi">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="22 2 11 13 22 22"></polyline>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
        <span>Forwarding</span>
      </div>
      <div class="menu-item" data-target="settingsSec" onclick="switchTab(this)" role="button" tabindex="0" aria-label="Pengaturan — Konfigurasi sistem">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2 2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
        <span>Pengaturan</span>
      </div>
    </div>
    <div class="sidebar-footer">
      <button class="btn-secondary" style="width: 100%; text-align: center;" onclick="logout()">Logout</button>
    </div>
  </aside>

  <!-- Main Content Wrapper -->
  <main class="main-content" id="mainContent">
    
    <!-- Top Header -->
    <div class="header-bar">
      <div class="menu-btn" onclick="toggleSidebar()" role="button" tabindex="0" aria-label="Buka menu navigasi">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </div>
      
      <div class="header-title">
        <h1 id="pageTitle">Overview</h1>
        <p id="pageSubtitle">Histori & Monitoring Notifikasi Pembayaran</p>
      </div>

      <div class="user-info">
        <div class="avatar" id="userAvatar">A</div>
        <span id="userGreeting" style="font-weight: 500;">Admin</span>
      </div>
    </div>

    <!-- SECTION 1: DASHBOARD OVERVIEW -->
    <div id="dashboardSec" class="section active">
      <div id="dashboardAlert" class="status-alert" style="margin-bottom: 20px;"></div>
      
      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stats-card">
          <div class="stats-card-left">
            <h3>Total Notif</h3>
            <div id="statTotal" class="value">-</div>
          </div>
          <div class="stats-icon stats-total">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </div>
        </div>

        <div class="stats-card">
          <div class="stats-card-left">
            <h3>Hari Ini</h3>
            <div id="statToday" class="value">-</div>
          </div>
          <div class="stats-icon stats-today">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
        </div>

        <div class="stats-card">
          <div class="stats-card-left">
            <h3>Ada Nominal</h3>
            <div id="statNominal" class="value">-</div>
          </div>
          <div class="stats-icon stats-success">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
        </div>

        <div class="stats-card">
          <div class="stats-card-left">
            <h3>Penyedia App</h3>
            <div id="statApps" class="value">-</div>
          </div>
          <div class="stats-icon stats-apps">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Main Log Table -->
      <div class="content-card">
        <div class="card-header">
          <div class="table-controls">
            <div class="search-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input type="text" id="searchInput" class="search-input" placeholder="Cari berdasarkan judul, pesan..." oninput="debounceSearch()">
            </div>
            
            <select id="appFilter" class="select-input" onchange="handleAppFilter()">
              <option value="">Semua Aplikasi</option>
            </select>
          </div>
        </div>

        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Aplikasi</th>
                <th>Judul & Teks</th>
                <th>Nominal</th>
                <th>Diterima (Device)</th>
                <th>Disimpan (Server)</th>
                <th style="text-align: right;">Aksi</th>
              </tr>
            </thead>
            <tbody id="notifTableBody">
              <tr>
                <td colspan="6" style="padding: 16px 24px;">
                  <div style="display:flex;gap:12px;align-items:center;margin-bottom:12px;">
                    <div class="skeleton" style="width:60px;height:24px;"></div>
                    <div class="skeleton" style="flex:1;height:16px;"></div>
                    <div class="skeleton" style="width:80px;height:16px;"></div>
                    <div class="skeleton" style="width:100px;height:16px;"></div>
                    <div class="skeleton" style="width:60px;height:28px;"></div>
                  </div>
                  <div style="display:flex;gap:12px;align-items:center;margin-bottom:12px;">
                    <div class="skeleton" style="width:70px;height:24px;"></div>
                    <div class="skeleton" style="flex:1;height:16px;"></div>
                    <div class="skeleton" style="width:90px;height:16px;"></div>
                    <div class="skeleton" style="width:100px;height:16px;"></div>
                    <div class="skeleton" style="width:60px;height:28px;"></div>
                  </div>
                  <div style="display:flex;gap:12px;align-items:center;">
                    <div class="skeleton" style="width:55px;height:24px;"></div>
                    <div class="skeleton" style="flex:1;height:16px;"></div>
                    <div class="skeleton" style="width:85px;height:16px;"></div>
                    <div class="skeleton" style="width:100px;height:16px;"></div>
                    <div class="skeleton" style="width:60px;height:28px;"></div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Cards View -->
        <div id="notifCardsContainer">
          <div style="display:flex;flex-direction:column;gap:12px;">
            <div style="background:rgba(255,255,255,0.02);border:1px solid var(--card-border);border-radius:16px;padding:16px;">
              <div style="display:flex;justify-content:space-between;margin-bottom:10px;">
                <div class="skeleton" style="width:60px;height:20px;"></div>
                <div class="skeleton" style="width:80px;height:14px;"></div>
              </div>
              <div class="skeleton" style="width:70%;height:16px;margin-bottom:6px;"></div>
              <div class="skeleton" style="width:90%;height:14px;margin-bottom:12px;"></div>
              <div style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid rgba(255,255,255,0.04);padding-top:10px;">
                <div class="skeleton" style="width:80px;height:18px;"></div>
                <div style="display:flex;gap:8px;">
                  <div class="skeleton" style="width:50px;height:28px;"></div>
                  <div class="skeleton" style="width:60px;height:28px;"></div>
                </div>
              </div>
            </div>
            <div style="background:rgba(255,255,255,0.02);border:1px solid var(--card-border);border-radius:16px;padding:16px;">
              <div style="display:flex;justify-content:space-between;margin-bottom:10px;">
                <div class="skeleton" style="width:70px;height:20px;"></div>
                <div class="skeleton" style="width:80px;height:14px;"></div>
              </div>
              <div class="skeleton" style="width:60%;height:16px;margin-bottom:6px;"></div>
              <div class="skeleton" style="width:80%;height:14px;margin-bottom:12px;"></div>
              <div style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid rgba(255,255,255,0.04);padding-top:10px;">
                <div class="skeleton" style="width:90px;height:18px;"></div>
                <div style="display:flex;gap:8px;">
                  <div class="skeleton" style="width:50px;height:28px;"></div>
                  <div class="skeleton" style="width:60px;height:28px;"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="pagination">
          <button id="prevBtn" class="btn-secondary" onclick="prevPage()" disabled>Sebelumnya</button>
          <span id="pageInfo" style="font-size: 13px; color: var(--text-muted);">Halaman 1</span>
          <button id="nextBtn" class="btn-secondary" onclick="nextPage()" disabled>Selanjutnya</button>
        </div>
      </div>
    </div>

    <!-- SECTION 2: FORWARDING CONFIG -->
    <div id="forwardingSec" class="section">
      <div id="forwardingAlert" class="status-alert"></div>

      <div class="integration-header" style="margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h2 style="font-size: 20px; font-weight: 600;">Daftar Integrasi</h2>
          <p style="font-size: 13px; color: var(--text-muted);">Kelola beberapa bot Telegram, Webhook Discord, atau Custom Webhook sekaligus.</p>
        </div>
        <button type="button" class="btn-primary" onclick="openAddIntegrationModal()" style="display: flex; align-items: center; gap: 8px;">
          <svg style="width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 2.5;" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Tambah Integrasi
        </button>
      </div>

      <!-- Integrations Grid / List -->
      <div id="integrationsListContainer" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; margin-bottom: 30px;">
        <div style="grid-column: 1 / -1; padding: 20px; background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 20px; backdrop-filter: blur(10px); display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px;">
          <div style="background:rgba(255,255,255,0.02);border:1px solid var(--card-border);border-radius:16px;padding:20px;">
            <div style="display:flex;justify-content:space-between;margin-bottom:14px;">
              <div style="display:flex;gap:10px;align-items:center;">
                <div class="skeleton" style="width:36px;height:36px;border-radius:10px;"></div>
                <div><div class="skeleton" style="width:80px;height:12px;margin-bottom:6px;"></div><div class="skeleton" style="width:120px;height:16px;"></div></div>
              </div>
              <div class="skeleton" style="width:44px;height:24px;border-radius:12px;"></div>
            </div>
            <div class="skeleton" style="width:60%;height:12px;"></div>
          </div>
          <div style="background:rgba(255,255,255,0.02);border:1px solid var(--card-border);border-radius:16px;padding:20px;">
            <div style="display:flex;justify-content:space-between;margin-bottom:14px;">
              <div style="display:flex;gap:10px;align-items:center;">
                <div class="skeleton" style="width:36px;height:36px;border-radius:10px;"></div>
                <div><div class="skeleton" style="width:70px;height:12px;margin-bottom:6px;"></div><div class="skeleton" style="width:100px;height:16px;"></div></div>
              </div>
              <div class="skeleton" style="width:44px;height:24px;border-radius:12px;"></div>
            </div>
            <div class="skeleton" style="width:50%;height:12px;"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- SECTION 3: SETTINGS -->
    <div id="settingsSec" class="section">
      
      <!-- Card 1: API Configuration -->
      <div class="content-card form-card">
        <div class="card-header">
          <h2>Konfigurasi API</h2>
        </div>
        <div style="padding: 30px;">
          <div id="apiSettingsAlert" class="status-alert"></div>
          
          <form id="apiSettingsForm">
            <div class="form-group">
              <label for="apiSecretInput">API Secret Token (X-API-Secret)</label>
              <div style="display: flex; gap: 10px;">
                <input type="text" id="apiSecretInput" class="form-control" placeholder="Masukkan API Secret Token" required style="flex: 1;">
                <button type="button" class="btn-secondary" onclick="generateRandomSecret()" style="white-space: nowrap;">Acak Token</button>
              </div>
              <p style="font-size: 11px; color: var(--text-muted); margin-top: 8px;">Token ini harus sama dengan header X-API-Secret di aplikasi Flutter Anda.</p>
            </div>
            
            <button type="submit" class="btn-primary">Simpan API Secret</button>
          </form>
        </div>
      </div>

      <!-- Card 2: Change Admin Credentials -->
      <div class="content-card form-card">
        <div class="card-header">
          <h2>Ganti Kredensial Admin</h2>
        </div>
        <div style="padding: 30px;">
          <div id="settingsAlert" class="status-alert"></div>
          
          <form id="settingsForm">
            <div class="form-group">
              <label for="newUsername">Username Baru</label>
              <input type="text" id="newUsername" class="form-control" placeholder="Masukkan username baru" required>
            </div>
            
            <div class="form-group">
              <label for="oldPassword">Password Saat Ini</label>
              <div class="password-wrapper">
                <input type="password" id="oldPassword" class="form-control" placeholder="Masukkan password sekarang" required>
                <button type="button" class="password-toggle" onclick="togglePassword('oldPassword', this)" aria-label="Tampilkan password">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>
              </div>
            </div>

            <div class="form-group">
              <label for="newPassword">Password Baru</label>
              <div class="password-wrapper">
                <input type="password" id="newPassword" class="form-control" placeholder="Masukkan password baru" required>
                <button type="button" class="password-toggle" onclick="togglePassword('newPassword', this)" aria-label="Tampilkan password">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>
              </div>
            </div>

            <div class="form-group">
              <label for="confirmPassword">Konfirmasi Password Baru</label>
              <div class="password-wrapper">
                <input type="password" id="confirmPassword" class="form-control" placeholder="Ulangi password baru" required>
                <button type="button" class="password-toggle" onclick="togglePassword('confirmPassword', this)" aria-label="Tampilkan password">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>
              </div>
            </div>

            <button type="submit" class="btn-primary">Simpan Kredensial Baru</button>
          </form>
        </div>
      </div>

      <!-- Card 3: Integrasi API & Contoh Code -->
      <div class="content-card form-card" style="margin-top: 30px;">
        <div class="card-header">
          <h2>Panduan Integrasi API</h2>
        </div>
        <div style="padding: 30px;">
          <p style="font-size: 14px; color: var(--text-light); margin-bottom: 20px; line-height: 1.5;">
            Anda dapat mengirimkan notifikasi dari aplikasi lain atau backend kustom Anda dengan mengirimkan request HTTP POST ke endpoint <code>/notify</code>. Gunakan header <code>X-API-Secret</code> untuk autentikasi.
          </p>
          
          <!-- Tab Headers -->
          <div style="display: flex; gap: 8px; border-bottom: 1px solid var(--card-border); padding-bottom: 10px; margin-bottom: 20px; overflow-x: auto;">
            <button type="button" class="tab-btn active" onclick="switchCodeTab('curl')" id="tab-curl">cURL</button>
            <button type="button" class="tab-btn" onclick="switchCodeTab('node')" id="tab-node">Node.js</button>
            <button type="button" class="tab-btn" onclick="switchCodeTab('php')" id="tab-php">PHP</button>
            <button type="button" class="tab-btn" onclick="switchCodeTab('python')" id="tab-python">Python</button>
            <button type="button" class="tab-btn" onclick="switchCodeTab('dart')" id="tab-dart">Dart/Flutter</button>
          </div>
          
          <!-- Code Blocks -->
          <div class="code-block-container" style="position: relative;">
            <button type="button" onclick="copySampleCode()" style="position: absolute; top: 10px; right: 10px; background: rgba(255,255,255,0.08); border: 1px solid var(--card-border); border-radius: 6px; padding: 6px 10px; font-size: 11px; color: #fff; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: 0.2s;">
              <svg style="width: 14px; height: 14px; stroke: currentColor; fill: none; stroke-width: 2;" viewBox="0 0 24 24"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
              Copy
            </button>
            <pre id="codePreview" style="background: rgba(0,0,0,0.3); border: 1px solid var(--card-border); border-radius: 12px; padding: 16px; color: #34D399; font-family: monospace; font-size: 12px; overflow-x: auto; max-height: 380px; line-height: 1.6; margin: 0; white-space: pre;"></pre>
          </div>
        </div>
      </div>
    </div>
  </main>

  <!-- Detail Modal -->
  <div class="modal-backdrop" id="modalBackdrop" onclick="closeModal()">
    <div class="modal" onclick="event.stopPropagation()" role="dialog" aria-modal="true" aria-label="Detail Notifikasi">
      <div class="modal-header">
        <h3>Detail Notifikasi</h3>
        <button class="modal-close" onclick="closeModal()" aria-label="Tutup modal detail">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="modal-body" id="modalContent">
        <!-- Dyn content -->
      </div>
    </div>
  </div>

  <!-- Add/Edit Integration Modal -->
  <div class="modal-backdrop" id="integrationModalBackdrop" onclick="closeIntegrationModal()">
    <div class="modal" onclick="event.stopPropagation()" style="max-width: 550px;" role="dialog" aria-modal="true" aria-label="Form integrasi">
      <div class="modal-header">
        <h3 id="integrationModalTitle">Tambah Integrasi</h3>
        <button class="modal-close" onclick="closeIntegrationModal()" aria-label="Tutup modal integrasi">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="modal-body" style="max-height: 80vh; overflow-y: auto;">
        <div id="integrationModalAlert" class="status-alert"></div>
        
        <form id="integrationForm" onsubmit="saveIntegration(event)">
          <input type="hidden" id="intId">
          
          <div class="form-group">
            <label for="intName">Nama Integrasi</label>
            <input type="text" id="intName" class="form-control" placeholder="Contoh: Kirim ke Grup Keuangan" required>
          </div>
          
          <div class="form-group">
            <label for="intType">Tipe Integrasi</label>
            <select id="intType" class="form-control" onchange="handleIntegrationTypeChange()" style="cursor: pointer;">
              <option value="telegram">Telegram Bot</option>
              <option value="discord">Discord Webhook</option>
              <option value="custom">Custom Webhook (POST)</option>
              <option value="wa_official">WA Official (Meta Cloud API)</option>
            </select>
          </div>
          
          <!-- Conditional Fields: Telegram -->
          <div id="fieldsTelegram" class="integration-fields">
            <div class="form-group">
              <label for="intTgBotToken">Telegram Bot Token</label>
              <input type="text" id="intTgBotToken" class="form-control" placeholder="Masukkan Bot Token dari @BotFather">
            </div>
            <div class="form-group">
              <label for="intTgChatId">Telegram Chat ID</label>
              <input type="text" id="intTgChatId" class="form-control" placeholder="Masukkan Chat ID penerima (Grup/Pribadi)">
            </div>
          </div>
          
          <!-- Conditional Fields: Discord -->
          <div id="fieldsDiscord" class="integration-fields" style="display: none;">
            <div class="form-group">
              <label for="intDiscordWebhookUrl">Discord Webhook URL</label>
              <input type="text" id="intDiscordWebhookUrl" class="form-control" placeholder="https://discord.com/api/webhooks/...">
            </div>
          </div>
          
          <!-- Conditional Fields: Custom -->
          <div id="fieldsCustom" class="integration-fields" style="display: none;">
            <div class="form-group">
              <label for="intCustomUrl">Webhook Target URL</label>
              <input type="text" id="intCustomUrl" class="form-control" placeholder="https://api.domainanda.com/webhook/payment">
            </div>
            <div class="form-group">
              <label for="intCustomHeaders">Custom Headers (JSON Format)</label>
              <textarea id="intCustomHeaders" class="form-control" style="min-height:90px; font-family:monospace;" placeholder='{ "Authorization": "Bearer token123" }'></textarea>
            </div>
            <div class="form-group" style="margin-top: 16px;">
              <label style="display: block; margin-bottom: 6px; font-size: 13px; color: var(--text-light); font-weight: 500;">Preview POST Data (JSON)</label>
              <div style="background: rgba(0, 0, 0, 0.25); border: 1px solid var(--card-border); border-radius: 12px; padding: 12px; font-family: monospace; font-size: 11px; color: #34D399; overflow-x: auto; max-height: 180px; line-height: 1.5; white-space: pre;">{
  "id": "4a5b6c7d-8e9f-0a1b-2c3d-4e5f6a7b8c9d",
  "source_app": "com.bank.mobile",
  "source_app_label": "Bank Mobile App",
  "title": "Transfer Masuk",
  "text": "QRIS Rp75.000 dari SITI AMINAH berhasil",
  "big_text": "QRIS Rp75.000 dari SITI AMINAH berhasil pada 06/06 21:50",
  "nominal_raw": "Rp75.000",
  "nominal": 75000,
  "notif_id": 987654,
  "received_at": "2026-06-06T21:50:00.000Z",
  "created_at": "2026-06-06T21:50:05.000Z"
}</div>
            </div>
          </div>
          
          <!-- Conditional Fields: WA Official -->
          <div id="fieldsWaOfficial" class="integration-fields" style="display: none;">
            <div class="form-group">
              <label for="intWaAccessToken">Meta Access Token</label>
              <input type="text" id="intWaAccessToken" class="form-control" placeholder="EAABw...">
            </div>
            <div class="form-group">
              <label for="intWaPhoneNumberId">Phone Number ID</label>
              <input type="text" id="intWaPhoneNumberId" class="form-control" placeholder="ID nomor telepon pengirim dari Meta Developer Portal">
            </div>
            <div class="form-group">
              <label for="intWaRecipientPhone">Nomor HP Penerima</label>
              <input type="text" id="intWaRecipientPhone" class="form-control" placeholder="Contoh: 628123456789">
              <small style="color: var(--text-muted); font-size: 11px; margin-top: 6px; display: block; line-height: 1.4;">
                Note: Pesan dikirim sebagai <b>Session Message (Tipe Text)</b> gratis. Penerima harus mengirim pesan ke WhatsApp bot Anda terlebih dahulu dalam 24 jam terakhir untuk membuka sesi gratis (customer service window).
              </small>
            </div>
          </div>
          
          <div style="display: flex; gap: 12px; margin-top: 32px; justify-content: flex-end;">
            <button type="button" class="btn-secondary" onclick="testIntegrationFromModal()" style="padding: 10px 18px;">Kirim Test</button>
            <button type="button" class="btn-secondary" onclick="closeIntegrationModal()" style="padding: 10px 18px;">Batal</button>
            <button type="submit" class="btn-primary" style="padding: 10px 24px;">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Custom Confirm Modal -->
  <div class="modal-backdrop" id="confirmBackdrop">
    <div class="modal" onclick="event.stopPropagation()" role="alertdialog" aria-modal="true" aria-labelledby="confirmMessage" style="max-width: 420px;">
      <div class="modal-header">
        <h3>Konfirmasi</h3>
        <button class="modal-close" onclick="closeConfirm()" aria-label="Tutup konfirmasi">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="modal-body">
        <p id="confirmMessage" style="font-size: 14px; color: var(--text-main); line-height: 1.6;"></p>
        <div class="confirm-actions">
          <button type="button" class="btn-secondary" id="confirmNo" style="padding: 10px 20px;">Batal</button>
          <button type="button" class="btn-danger" id="confirmYes">Ya, Lanjutkan</button>
        </div>
      </div>
    </div>
  </div>

  <script>
    let limit = 15;
    let offset = 0;
    let totalItems = 0;
    let sourceAppFilter = '';
    let searchQuery = '';
    let availableApps = new Set();
    let allNotifications = [];

    // === Utility Functions ===

    // Password toggle
    function togglePassword(inputId, btn) {
      const input = document.getElementById(inputId);
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      btn.setAttribute('aria-label', isPassword ? 'Sembunyikan password' : 'Tampilkan password');
    }

    // Toast notification
    function showToast(message, type) {
      type = type || 'success';
      const toast = document.createElement('div');
      toast.className = 'toast toast-' + type;
      toast.textContent = message;
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
      setTimeout(function() {
        toast.style.animation = 'fadeOut 0.3s ease-in forwards';
        setTimeout(function() { toast.remove(); }, 300);
      }, 2500);
    }

    // Custom confirm
    let confirmResolve = null;
    function showConfirm(message, onConfirm) {
      var backdrop = document.getElementById('confirmBackdrop');
      document.getElementById('confirmMessage').textContent = message;
      backdrop.style.display = 'flex';
      document.getElementById('confirmYes').onclick = function() {
        backdrop.style.display = 'none';
        if (onConfirm) onConfirm();
      };
      document.getElementById('confirmNo').onclick = function() {
        backdrop.style.display = 'none';
      };
    }
    function closeConfirm() {
      document.getElementById('confirmBackdrop').style.display = 'none';
    }

    // Escape key handler for all modals
    let lastFocusedElement = null;
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        var detailModal = document.getElementById('modalBackdrop');
        var intModal = document.getElementById('integrationModalBackdrop');
        var confirmModal = document.getElementById('confirmBackdrop');
        if (detailModal.style.display === 'flex') { closeModal(); }
        else if (intModal.style.display === 'flex') { closeIntegrationModal(); }
        else if (confirmModal.style.display === 'flex') { closeConfirm(); }
      }
    });

    // Focus trap helper
    function trapFocus(modalElement) {
      var focusable = modalElement.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusable.length === 0) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      first.focus();
      modalElement.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
          if (e.shiftKey && document.activeElement === first) {
            last.focus(); e.preventDefault();
          } else if (!e.shiftKey && document.activeElement === last) {
            first.focus(); e.preventDefault();
          }
        }
      });
    }

    // Field error helpers
    function showFieldError(fieldId, message) {
      var field = document.getElementById(fieldId);
      if (!field) return;
      clearFieldError(fieldId);
      field.style.borderColor = 'var(--error)';
      var errorEl = document.createElement('div');
      errorEl.className = 'field-error';
      errorEl.textContent = message;
      field.parentElement.appendChild(errorEl);
    }
    function clearFieldError(fieldId) {
      var field = document.getElementById(fieldId);
      if (!field) return;
      field.style.borderColor = '';
      var existing = field.parentElement.querySelector('.field-error');
      if (existing) existing.remove();
    }
    function clearFieldErrors(formId) {
      var form = document.getElementById(formId);
      if (!form) return;
      form.querySelectorAll('.field-error').forEach(function(el) { el.remove(); });
      form.querySelectorAll('input, select, textarea').forEach(function(el) { el.style.borderColor = ''; });
    }

    // Init load
    window.addEventListener('DOMContentLoaded', () => {
      fetchStats();
      fetchNotifications();
      fetchAdminSettings();
      fetchIntegrations();
    });

    async function fetchStats() {
      try {
        const res = await fetch('/api/admin/stats');
        if (res.status === 401) {
          window.location.href = '/login';
          return;
        }
        const data = await res.json();
        if (data.ok) {
          document.getElementById('statTotal').textContent = data.stats.total;
          document.getElementById('statToday').textContent = data.stats.today;
          document.getElementById('statNominal').textContent = data.stats.with_nominal;
          document.getElementById('statApps').textContent = data.stats.unique_apps;
        }
      } catch (err) {
        console.error('Gagal mengambil statistik', err);
      }
    }

    async function fetchAdminSettings() {
      try {
        const res = await fetch('/api/admin/settings');
        if (res.status === 401) {
          window.location.href = '/login';
          return;
        }
        const data = await res.json();
        if (data.ok) {
          document.getElementById('userGreeting').textContent = data.username;
          document.getElementById('userAvatar').textContent = data.username.charAt(0).toUpperCase();
          document.getElementById('apiSecretInput').value = data.api_secret || '';
          updateCodeSnippets();
        }
      } catch (e) {
        console.error('Gagal mengambil pengaturan admin', e);
      }
    }

    async function fetchNotifications() {
      try {
        const url = new URL('/api/admin/notifications', window.location.origin);
        url.searchParams.set('limit', limit);
        url.searchParams.set('offset', offset);
        if (sourceAppFilter) {
          url.searchParams.set('source_app', sourceAppFilter);
        }
        if (searchQuery) {
          url.searchParams.set('search', searchQuery);
        }

        const res = await fetch(url);
        if (res.status === 401) {
          window.location.href = '/login';
          return;
        }

        const result = await res.json();
        if (result.ok) {
          totalItems = result.total;
          allNotifications = result.data || [];
          renderTable(allNotifications);
          updatePaginationUI();
          updateAppFilterDropdown(result.all_apps || []);
        }
      } catch (err) {
        console.error('Gagal mengambil data notifikasi', err);
      }
    }

    function renderTable(notifications) {
      const tbody = document.getElementById('notifTableBody');
      const cardContainer = document.getElementById('notifCardsContainer');
      
      tbody.innerHTML = '';
      cardContainer.innerHTML = '';
      
      if (notifications.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px; color: var(--text-muted);">Tidak ada data notifikasi</td></tr>';
        cardContainer.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--text-muted); font-size: 14px;">Tidak ada data notifikasi</div>';
        return;
      }
      
      notifications.forEach(n => {
        let nominalText = '-';
        if (n.nominal !== null && n.nominal !== undefined) {
          nominalText = 'Rp ' + Number(n.nominal).toLocaleString('id-ID');
        }
        
        const dateDevice = formatDate(n.received_at);
        const dateServer = formatDate(n.created_at);
        
        const titleEscaped = escapeHtml(n.title || '');
        const textEscaped = escapeHtml(n.text || '');
        const appLabel = escapeHtml(n.source_app_label || n.source_app || '-');
        
        const tr = document.createElement('tr');
        tr.innerHTML = \`
          <td><span class="badge badge-info" style="font-size: 11px;">\${appLabel}</span></td>
          <td>
            <div style="font-weight: 600; color: #fff;">\${titleEscaped}</div>
            <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">\${textEscaped}</div>
          </td>
          <td><span style="font-weight: 600; color: var(--success);">\${nominalText}</span></td>
          <td style="font-size: 12px;">\${dateDevice}</td>
          <td style="font-size: 12px;">\${dateServer}</td>
          <td style="text-align: right;">
            <button class="btn-secondary btn-sm" onclick="showDetails('\${n.id}')">Detail</button>
            <button class="btn-secondary btn-sm" onclick="forwardNotification('\${n.id}')" style="margin-left: 6px;">Forward</button>
          </td>
        \`;
        tbody.appendChild(tr);
        
        const card = document.createElement('div');
        card.className = 'content-card';
        card.style.margin = '0 0 16px 0';
        card.style.padding = '16px';
        card.innerHTML = \`
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
            <span class="badge badge-info" style="font-size: 10px;">\${appLabel}</span>
            <span style="font-size: 12px; color: var(--text-muted);">\${dateServer}</span>
          </div>
          <div style="font-weight: 600; color: #fff; margin-bottom: 4px;">\${titleEscaped}</div>
          <div style="font-size: 13px; color: var(--text-muted); margin-bottom: 12px;">\${textEscaped}</div>
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 10px;">
            <div>
              <div style="font-size: 10px; color: var(--text-muted);">Nominal</div>
              <div style="font-weight: 600; color: var(--success); font-size: 14px;">\${nominalText}</div>
            </div>
            <div style="display: flex; gap: 8px;">
              <button class="btn-secondary btn-sm" style="padding: 4px 10px; font-size: 12px;" onclick="showDetails('\${n.id}')">Detail</button>
              <button class="btn-secondary btn-sm" style="padding: 4px 10px; font-size: 12px;" onclick="forwardNotification('\${n.id}')">Forward</button>
            </div>
          </div>
        \`;
        cardContainer.appendChild(card);
      });
    }

    function updateAppFilterDropdown(allApps) {
      const select = document.getElementById('appFilter');
      const val = select.value;
      
      select.innerHTML = '<option value="">Semua Aplikasi</option>';
      
      allApps.forEach(app => {
        const opt = document.createElement('option');
        opt.value = app;
        opt.textContent = app;
        if (app === val) {
          opt.selected = true;
        }
        select.appendChild(opt);
      });
    }

    function updatePaginationUI() {
      const prevBtn = document.getElementById('prevBtn');
      const nextBtn = document.getElementById('nextBtn');
      const pageInfo = document.getElementById('pageInfo');
      
      const currentPage = Math.floor(offset / limit) + 1;
      const totalPages = Math.ceil(totalItems / limit) || 1;
      
      pageInfo.textContent = \`Halaman \${currentPage} dari \${totalPages}\`;
      
      prevBtn.disabled = (offset === 0);
      nextBtn.disabled = (offset + limit >= totalItems);
    }

    function prevPage() {
      if (offset >= limit) {
        offset -= limit;
        fetchNotifications();
      }
    }

    function nextPage() {
      if (offset + limit < totalItems) {
        offset += limit;
        fetchNotifications();
      }
    }

    let searchTimeout = null;
    function debounceSearch() {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(function() { handleSearch(); }, 300);
    }

    function handleSearch() {
      searchQuery = document.getElementById('searchInput').value;
      offset = 0;
      fetchNotifications();
    }

    function handleAppFilter() {
      sourceAppFilter = document.getElementById('appFilter').value;
      offset = 0;
      fetchNotifications();
    }

    function showDetails(id) {
      const notif = allNotifications.find(n => n.id === id);
      if (!notif) return;
      
      const content = document.getElementById('modalContent');
      
      let nominalText = '-';
      if (notif.nominal !== null && notif.nominal !== undefined) {
        nominalText = 'Rp ' + Number(notif.nominal).toLocaleString('id-ID');
      }
      
      let bigTextHtml = '';
      if (notif.big_text) {
        bigTextHtml = '<div>' +
          '<div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Pesan Lengkap (Big Text)</div>' +
          '<div style="color: var(--text-light); white-space: pre-wrap; word-break: break-word; background: rgba(0,0,0,0.2); padding: 10px; border-radius: 8px; font-size: 13px;">' + escapeHtml(notif.big_text) + '</div>' +
        '</div>';
      }
      
      content.innerHTML = \`
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <div>
            <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Aplikasi</div>
            <div style="font-weight: 600; color: #fff;">\${escapeHtml(notif.source_app_label || notif.source_app || '-')}</div>
            <div style="font-size: 11px; color: var(--text-muted); font-family: monospace; margin-top: 2px;">\${escapeHtml(notif.source_app)}</div>
          </div>
          
          <div>
            <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Judul</div>
            <div style="font-weight: 500; color: #fff;">\${escapeHtml(notif.title || '-')}</div>
          </div>
          
          <div>
            <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Pesan</div>
            <div style="color: var(--text-light); white-space: pre-wrap; word-break: break-word;">\${escapeHtml(notif.text || '-')}</div>
          </div>
          
          \${bigTextHtml}
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div>
              <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Nominal Terdeteksi</div>
              <div style="font-weight: 600; color: var(--success); font-size: 15px;">\${nominalText}</div>
            </div>
            <div>
              <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Raw Nominal Text</div>
              <div style="color: #fff; font-weight: 500;">\${escapeHtml(notif.nominal_raw || '-')}</div>
            </div>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 16px;">
            <div>
              <div style="font-size: 10px; color: var(--text-muted); margin-bottom: 2px;">Diterima di HP</div>
              <div style="font-size: 13px; color: #fff;">\${formatDate(notif.received_at)}</div>
            </div>
            <div>
              <div style="font-size: 10px; color: var(--text-muted); margin-bottom: 2px;">Disimpan di Server</div>
              <div style="font-size: 13px; color: #fff;">\${formatDate(notif.created_at)}</div>
            </div>
          </div>
          
          <div>
            <div style="font-size: 10px; color: var(--text-muted); margin-bottom: 2px;">ID Notifikasi HP</div>
            <div style="font-size: 13px; color: #fff; font-family: monospace;">\${notif.notif_id || '-'}</div>
          </div>
        </div>
      \`;

      lastFocusedElement = document.activeElement;
      var backdrop = document.getElementById('modalBackdrop');
      backdrop.style.display = 'flex';
      setTimeout(function() { trapFocus(backdrop.querySelector('.modal')); }, 100);
    }

    async function forwardNotification(id) {
      showConfirm('Apakah Anda yakin ingin meneruskan notifikasi ini ke semua forwarding rule yang aktif?', async function() {
      const alertEl = document.getElementById('dashboardAlert');
      alertEl.style.display = 'none';
      alertEl.className = 'status-alert';
      
      try {
        const res = await fetch('/api/admin/notifications/forward', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });
        const data = await res.json();
        
        if (res.ok && data.ok) {
          alertEl.textContent = 'Notifikasi berhasil diteruskan!';
          alertEl.className = 'status-alert success';
          alertEl.style.display = 'block';
          setTimeout(() => alertEl.style.display = 'none', 4000);
        } else {
          alertEl.textContent = data.error || 'Gagal meneruskan notifikasi.';
          alertEl.className = 'status-alert error';
          alertEl.style.display = 'block';
        }
      } catch (err) {
        alertEl.textContent = 'Gagal menghubungi server.';
        alertEl.className = 'status-alert error';
        alertEl.style.display = 'block';
      }
      }); // end showConfirm
    }

    function closeModal() {
      var backdrop = document.getElementById('modalBackdrop');
      var modal = backdrop.querySelector('.modal');
      modal.style.animation = 'modalFadeOut 0.2s ease-in forwards';
      backdrop.style.animation = 'fadeOut 0.2s ease-in forwards';
      setTimeout(function() {
        backdrop.style.display = 'none';
        backdrop.style.animation = '';
        modal.style.animation = '';
        if (lastFocusedElement) { lastFocusedElement.focus(); lastFocusedElement = null; }
      }, 200);
    }

    function switchTab(el) {
      document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('active'));
      el.classList.add('active');
      
      document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
      const targetId = el.getAttribute('data-target');
      document.getElementById(targetId).classList.add('active');

      // Update titles
      if (targetId === 'dashboardSec') {
        document.getElementById('pageTitle').textContent = 'Overview';
        document.getElementById('pageSubtitle').textContent = 'Histori & Monitoring Notifikasi Pembayaran';
      } else if (targetId === 'forwardingSec') {
        document.getElementById('pageTitle').textContent = 'Forwarding';
        document.getElementById('pageSubtitle').textContent = 'Integrasi Notifikasi ke Layanan Pihak Ketiga';
      } else {
        document.getElementById('pageTitle').textContent = 'Pengaturan';
        document.getElementById('pageSubtitle').textContent = 'Konfigurasi Token API & Admin';
      }
      
      // Close mobile menu on click
      if (window.innerWidth <= 1024) {
        toggleSidebar();
      }
    }

    function toggleSidebar() {
      const isMobile = window.innerWidth <= 1024;
      if (isMobile) {
        const sidebar = document.getElementById('sidebar');
        const backdrop = document.getElementById('sidebarBackdrop');
        const isOpen = sidebar.classList.contains('open');
        
        if (isOpen) {
          sidebar.classList.remove('open');
          backdrop.style.display = 'none';
          backdrop.classList.remove('open');
        } else {
          sidebar.classList.add('open');
          backdrop.style.display = 'block';
          backdrop.classList.add('open');
        }
      }
    }

    async function logout() {
      try {
        const res = await fetch('/api/auth/logout', { method: 'POST' });
        if (res.ok) {
          window.location.href = '/login';
        }
      } catch (e) {
        window.location.href = '/login';
      }
    }

    function generateRandomSecret() {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < 32; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      document.getElementById('apiSecretInput').value = result;
      updateCodeSnippets();
    }

    let allIntegrations = [];

    async function fetchIntegrations() {
      try {
        const res = await fetch('/api/admin/forwarding');
        if (res.status === 401) {
          window.location.href = '/login';
          return;
        }
        const data = await res.json();
        if (data.ok) {
          allIntegrations = data.rules || [];
          renderIntegrations(allIntegrations);
        }
      } catch (err) {
        console.error('Gagal mengambil daftar integrasi', err);
      }
    }

    function renderIntegrations(rules) {
      const container = document.getElementById('integrationsListContainer');
      container.innerHTML = '';
      
      if (rules.length === 0) {
        container.innerHTML = \`
          <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted); background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 20px;">
            <svg style="width: 48px; height: 48px; color: var(--text-muted); margin-bottom: 12px; stroke: currentColor; stroke-width: 1.5; fill: none;" viewBox="0 0 24 24">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path>
            </svg>
            <div>Belum ada integrasi yang dikonfigurasi. Klik tombol "+ Tambah Integrasi" di atas.</div>
          </div>
        \`;
        return;
      }
      
      rules.forEach(rule => {
        let typeIcon = '';
        let typeLabel = '';
        let detailsSummary = '';
        
        let configObj = {};
        try {
          configObj = typeof rule.config === 'string' ? JSON.parse(rule.config) : rule.config;
        } catch(e) {}
        
        if (rule.type === 'telegram') {
          typeIcon = '<svg style="width:20px;height:20px;fill:#0088cc" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.12.82-.62 3.76-.88 5.16-.11.6-.33 1.2-.55 1.26-.48.14-.85-.14-1.32-.45-.73-.48-1.14-.78-1.85-1.25-.82-.53-.29-.82.18-1.3.12-.13 2.25-2.06 2.29-2.24.01-.02.01-.1-.04-.15-.05-.05-.12-.03-.17-.02-.07.01-1.19.75-3.36 2.22-.32.22-.61.33-.87.32-.29-.01-.84-.17-1.25-.3-.5-.16-.9-.25-.87-.53.02-.15.24-.31.66-.47 2.58-1.12 4.31-1.87 5.18-2.23.83-.34 2.55-.4 2.83-.4.06 0 .21.01.3.08.09.07.12.17.13.27 0 .09-.01.3-.02.4z"/></svg>';
          typeLabel = 'Telegram Bot';
          detailsSummary = 'Chat ID: ' + (configObj.chat_id || '-');
        } else if (rule.type === 'discord') {
          typeIcon = '<svg style="width:20px;height:20px;fill:#5865F2" viewBox="0 0 24 24"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3847-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1971.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9559-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.095 2.1568 2.419 0 1.3332-.9559 2.4189-2.1569 2.4189zm7.9756 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9558-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.095 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/></svg>';
          typeLabel = 'Discord Webhook';
          detailsSummary = 'URL: ' + (configObj.webhook_url ? configObj.webhook_url.substring(0, 30) + '...' : '-');
        } else if (rule.type === 'custom') {
          typeIcon = '<svg style="width:20px;height:20px;color:var(--info);fill:none;stroke:currentColor;stroke-width:2;" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>';
          typeLabel = 'Custom Webhook';
          detailsSummary = 'Target: ' + (configObj.custom_url ? configObj.custom_url.substring(0, 30) + '...' : '-');
        } else if (rule.type === 'wa_official') {
          typeIcon = '<svg style="width:20px;height:20px;fill:#25D366" viewBox="0 0 24 24"><path d="M12.004 2C6.48 2 2.002 6.477 2.002 12c0 1.767.46 3.427 1.266 4.887l-1.348 4.922 5.037-1.321A9.927 9.927 0 0 0 12.004 22c5.52 0 9.998-4.477 9.998-10S17.524 2 12.004 2zm0 18.232c-1.614 0-3.197-.432-4.582-1.25l-.33-.196-3.003.788.802-2.928-.215-.342A8.204 8.204 0 0 1 3.827 12c0-4.52 3.678-8.198 8.177-8.198 4.499 0 8.177 3.678 8.177 8.198s-3.678 8.198-8.177 8.198zm4.515-6.17c-.247-.124-1.464-.722-1.692-.804-.228-.083-.393-.124-.559.124-.166.248-.641.805-.786.97-.145.166-.29.186-.537.063a7.561 7.561 0 0 1-1.996-1.229 8.332 8.332 0 0 1-1.38-1.716c-.145-.248-.015-.383.11-.507.112-.112.247-.289.37-.434.124-.145.165-.248.248-.413.083-.165.042-.31-.02-.434-.063-.124-.559-1.348-.766-1.844-.202-.486-.407-.42-.559-.428-.145-.008-.31-.008-.475-.008a.916.916 0 0 0-.662.31c-.228.248-.868.847-.868 2.065 0 1.219.888 2.396.992 2.54.103.146 1.747 2.668 4.233 3.738.591.255 1.053.407 1.41.52.593.189 1.133.162 1.559.099.475-.072 1.464-.598 1.67-.176.207-.42.207-.785-.062-.909z"/></svg>';
          typeLabel = 'WA Official';
          detailsSummary = 'Penerima: ' + (configObj.recipient_phone || '-');
        }
        
        const card = document.createElement('div');
        card.className = 'content-card';
        card.style.margin = '0';
        card.style.display = 'flex';
        card.style.flexDirection = 'column';
        card.style.justifyContent = 'space-between';
        card.style.height = '100%';
        card.style.backdropFilter = 'blur(16px)';
        
        const isChecked = rule.enabled === 1 ? 'checked' : '';
        
        card.innerHTML = \`
          <div style="padding: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 36px; height: 36px; border-radius: 10px; background: rgba(255,255,255,0.05); border: 1px solid var(--card-border); display: flex; align-items: center; justify-content: center;">
                  \${typeIcon}
                </div>
                <div>
                  <span class="badge \${rule.type === 'custom' ? 'badge-info' : (rule.type === 'telegram' || rule.type === 'wa_official') ? 'badge-success' : 'badge-info'}" style="font-size: 9px; padding: 2px 6px; margin-bottom: 2px;">\${typeLabel}</span>
                  <h3 style="font-size: 15px; font-weight: 600; color: #fff; margin: 0; word-break: break-word;">\${escapeHtml(rule.name)}</h3>
                </div>
              </div>
              
              <label class="switch">
                <input type="checkbox" id="toggle-\${rule.id}" \${isChecked} onchange="toggleIntegration('\${rule.id}', this.checked)">
                <span class="slider"></span>
              </label>
            </div>
            
            <div style="font-size: 12px; color: var(--text-muted); word-break: break-all; margin-top: 10px;">
              \${escapeHtml(detailsSummary)}
            </div>
          </div>
          
          <div style="padding: 12px 20px; background: rgba(0,0,0,0.15); border-top: 1px solid var(--card-border); display: flex; gap: 8px; justify-content: flex-end;">
            <button type="button" class="btn-secondary btn-sm" onclick="testIntegrationById('\${rule.id}')" style="padding: 4px 10px;">Test</button>
            <button type="button" class="btn-secondary btn-sm" onclick='openEditIntegrationModal(\${JSON.stringify(rule).replace(/'/g, "&apos;")})' style="padding: 4px 10px;">Edit</button>
            <button type="button" class="btn-secondary btn-sm" onclick="deleteIntegration('\${rule.id}')" style="padding: 4px 10px; border-color: rgba(239, 68, 68, 0.2); color: var(--error);">Hapus</button>
          </div>
        \`;
        
        container.appendChild(card);
      });
    }

    function handleIntegrationTypeChange() {
      const type = document.getElementById('intType').value;
      document.querySelectorAll('.integration-fields').forEach(el => el.style.display = 'none');
      
      if (type === 'telegram') {
        document.getElementById('fieldsTelegram').style.display = 'block';
      } else if (type === 'discord') {
        document.getElementById('fieldsDiscord').style.display = 'block';
      } else if (type === 'custom') {
        document.getElementById('fieldsCustom').style.display = 'block';
      } else if (type === 'wa_official') {
        document.getElementById('fieldsWaOfficial').style.display = 'block';
      }
    }

    function openAddIntegrationModal() {
      document.getElementById('integrationModalTitle').textContent = 'Tambah Integrasi';
      document.getElementById('integrationForm').reset();
      document.getElementById('intId').value = '';
      
      const alertEl = document.getElementById('integrationModalAlert');
      alertEl.style.display = 'none';
      alertEl.className = 'status-alert';

      document.getElementById('intType').value = 'telegram';
      handleIntegrationTypeChange();

      lastFocusedElement = document.activeElement;
      var backdrop = document.getElementById('integrationModalBackdrop');
      backdrop.style.display = 'flex';
      setTimeout(function() { trapFocus(backdrop.querySelector('.modal')); }, 100);
    }

    function openEditIntegrationModal(rule) {
      document.getElementById('integrationModalTitle').textContent = 'Edit Integrasi';
      document.getElementById('integrationForm').reset();
      
      const alertEl = document.getElementById('integrationModalAlert');
      alertEl.style.display = 'none';
      alertEl.className = 'status-alert';
      
      document.getElementById('intId').value = rule.id;
      document.getElementById('intName').value = rule.name;
      document.getElementById('intType').value = rule.type;
      
      let configObj = {};
      try {
        configObj = typeof rule.config === 'string' ? JSON.parse(rule.config) : rule.config;
      } catch(e) {}
      
      if (rule.type === 'telegram') {
        document.getElementById('intTgBotToken').value = configObj.bot_token || '';
        document.getElementById('intTgChatId').value = configObj.chat_id || '';
      } else if (rule.type === 'discord') {
        document.getElementById('intDiscordWebhookUrl').value = configObj.webhook_url || '';
      } else if (rule.type === 'custom') {
        document.getElementById('intCustomUrl').value = configObj.custom_url || '';
        document.getElementById('intCustomHeaders').value = configObj.custom_headers 
          ? (typeof configObj.custom_headers === 'object' ? JSON.stringify(configObj.custom_headers) : configObj.custom_headers) 
          : '';
      } else if (rule.type === 'wa_official') {
        document.getElementById('intWaAccessToken').value = configObj.access_token || '';
        document.getElementById('intWaPhoneNumberId').value = configObj.phone_number_id || '';
        document.getElementById('intWaRecipientPhone').value = configObj.recipient_phone || '';
      }
      
      handleIntegrationTypeChange();
      lastFocusedElement = document.activeElement;
      var backdrop = document.getElementById('integrationModalBackdrop');
      backdrop.style.display = 'flex';
      setTimeout(function() { trapFocus(backdrop.querySelector('.modal')); }, 100);
    }

    function closeIntegrationModal() {
      var backdrop = document.getElementById('integrationModalBackdrop');
      var modal = backdrop.querySelector('.modal');
      modal.style.animation = 'modalFadeOut 0.2s ease-in forwards';
      backdrop.style.animation = 'fadeOut 0.2s ease-in forwards';
      setTimeout(function() {
        backdrop.style.display = 'none';
        backdrop.style.animation = '';
        modal.style.animation = '';
        if (lastFocusedElement) { lastFocusedElement.focus(); lastFocusedElement = null; }
      }, 200);
    }

    function getFormConfig() {
      const type = document.getElementById('intType').value;
      const config = {};

      if (type === 'telegram') {
        config.bot_token = document.getElementById('intTgBotToken').value.trim();
        config.chat_id = document.getElementById('intTgChatId').value.trim();
        if (!config.bot_token) {
          showFieldError('intTgBotToken', 'Bot Token wajib diisi');
          document.getElementById('intTgBotToken').focus();
          throw new Error('Bot Token wajib diisi');
        }
        if (!config.chat_id) {
          showFieldError('intTgChatId', 'Chat ID wajib diisi');
          document.getElementById('intTgChatId').focus();
          throw new Error('Chat ID wajib diisi');
        }
      } else if (type === 'discord') {
        config.webhook_url = document.getElementById('intDiscordWebhookUrl').value.trim();
        if (!config.webhook_url) {
          showFieldError('intDiscordWebhookUrl', 'Discord Webhook URL wajib diisi');
          document.getElementById('intDiscordWebhookUrl').focus();
          throw new Error('Discord Webhook URL wajib diisi');
        }
      } else if (type === 'custom') {
        config.custom_url = document.getElementById('intCustomUrl').value.trim();
        if (!config.custom_url) {
          showFieldError('intCustomUrl', 'Webhook Target URL wajib diisi');
          document.getElementById('intCustomUrl').focus();
          throw new Error('Webhook Target URL wajib diisi');
        }
        const headersStr = document.getElementById('intCustomHeaders').value.trim();
        if (headersStr) {
          try {
            config.custom_headers = JSON.parse(headersStr);
          } catch(e) {
            showFieldError('intCustomHeaders', 'Format Custom Headers tidak valid (Harus JSON valid)');
            throw new Error('Format Custom Headers tidak valid (Harus JSON valid)');
          }
        }
      } else if (type === 'wa_official') {
        config.access_token = document.getElementById('intWaAccessToken').value.trim();
        config.phone_number_id = document.getElementById('intWaPhoneNumberId').value.trim();
        config.recipient_phone = document.getElementById('intWaRecipientPhone').value.trim();
        if (!config.access_token) {
          showFieldError('intWaAccessToken', 'Access Token wajib diisi');
          document.getElementById('intWaAccessToken').focus();
          throw new Error('Access Token wajib diisi');
        }
        if (!config.phone_number_id) {
          showFieldError('intWaPhoneNumberId', 'Phone Number ID wajib diisi');
          document.getElementById('intWaPhoneNumberId').focus();
          throw new Error('Phone Number ID wajib diisi');
        }
        if (!config.recipient_phone) {
          showFieldError('intWaRecipientPhone', 'Nomor HP Penerima wajib diisi');
          document.getElementById('intWaRecipientPhone').focus();
          throw new Error('Nomor HP Penerima wajib diisi');
        }
      }
      return config;
    }

    async function saveIntegration(event) {
      event.preventDefault();

      const alertEl = document.getElementById('integrationModalAlert');
      alertEl.style.display = 'none';
      alertEl.className = 'status-alert';
      clearFieldErrors('integrationForm');
      
      const id = document.getElementById('intId').value;
      const name = document.getElementById('intName').value.trim();
      const type = document.getElementById('intType').value;
      
      let config;
      try {
        config = getFormConfig();
      } catch (err) {
        alertEl.textContent = err.message;
        alertEl.classList.add('error');
        return;
      }
      
      const payload = {
        id: id || undefined,
        name,
        type,
        config,
        enabled: id ? undefined : 1
      };
      
      try {
        const res = await fetch('/api/admin/forwarding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        
        if (res.ok && data.ok) {
          closeIntegrationModal();
          fetchIntegrations();
          
          const mainAlert = document.getElementById('forwardingAlert');
          mainAlert.textContent = id ? 'Integrasi berhasil diperbarui!' : 'Integrasi baru berhasil ditambahkan!';
          mainAlert.className = 'status-alert success';
          mainAlert.style.display = 'block';
          setTimeout(() => mainAlert.style.display = 'none', 4000);
        } else {
          alertEl.textContent = data.error || 'Gagal menyimpan integrasi.';
          alertEl.classList.add('error');
        }
      } catch (err) {
        alertEl.textContent = 'Gagal menghubungi server.';
        alertEl.classList.add('error');
      }
    }

    async function toggleIntegration(id, enabled) {
      const mainAlert = document.getElementById('forwardingAlert');
      mainAlert.style.display = 'none';
      
      try {
        const res = await fetch('/api/admin/forwarding/toggle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, enabled: enabled ? 1 : 0 })
        });
        const data = await res.json();
        if (res.ok && data.ok) {
          mainAlert.textContent = enabled ? 'Integrasi diaktifkan!' : 'Integrasi dinonaktifkan!';
          mainAlert.className = 'status-alert success';
          mainAlert.style.display = 'block';
          setTimeout(() => mainAlert.style.display = 'none', 3000);
          fetchIntegrations();
        } else {
          mainAlert.textContent = data.error || 'Gagal mengubah status integrasi.';
          mainAlert.className = 'status-alert error';
          mainAlert.style.display = 'block';
          document.getElementById('toggle-' + id).checked = !enabled;
        }
      } catch (err) {
        mainAlert.textContent = 'Gagal menghubungi server.';
        mainAlert.className = 'status-alert error';
        mainAlert.style.display = 'block';
        document.getElementById('toggle-' + id).checked = !enabled;
      }
    }

    async function deleteIntegration(id) {
      showConfirm('Apakah Anda yakin ingin menghapus integrasi ini? Tindakan ini tidak dapat dibatalkan.', async function() {
      const mainAlert = document.getElementById('forwardingAlert');
      mainAlert.style.display = 'none';
      
      try {
        const res = await fetch('/api/admin/forwarding/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });
        const data = await res.json();
        if (res.ok && data.ok) {
          mainAlert.textContent = 'Integrasi berhasil dihapus!';
          mainAlert.className = 'status-alert success';
          mainAlert.style.display = 'block';
          setTimeout(() => mainAlert.style.display = 'none', 4000);
          fetchIntegrations();
        } else {
          mainAlert.textContent = data.error || 'Gagal menghapus integrasi.';
          mainAlert.className = 'status-alert error';
          mainAlert.style.display = 'block';
        }
      } catch (err) {
        mainAlert.textContent = 'Gagal menghubungi server.';
        mainAlert.className = 'status-alert error';
        mainAlert.style.display = 'block';
      }
      }); // end showConfirm
    }

    async function testIntegrationById(id) {
      const mainAlert = document.getElementById('forwardingAlert');
      mainAlert.style.display = 'none';
      
      const rule = allIntegrations.find(r => r.id === id);
      if (!rule) return;
      
      try {
        const res = await fetch('/api/admin/forwarding/test', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: rule.type, config: rule.config })
        });
        const data = await res.json();
        if (res.ok && data.ok) {
          mainAlert.textContent = 'Pesan uji berhasil dikirim! Periksa aplikasi target Anda.';
          mainAlert.className = 'status-alert success';
          mainAlert.style.display = 'block';
          setTimeout(() => mainAlert.style.display = 'none', 4000);
        } else {
          mainAlert.textContent = data.error || 'Gagal mengirim pesan uji.';
          mainAlert.className = 'status-alert error';
          mainAlert.style.display = 'block';
        }
      } catch (err) {
        mainAlert.textContent = 'Gagal menghubungi server.';
        mainAlert.className = 'status-alert error';
        mainAlert.style.display = 'block';
      }
    }

    async function testIntegrationFromModal() {
      const alertEl = document.getElementById('integrationModalAlert');
      alertEl.style.display = 'none';
      alertEl.className = 'status-alert';
      
      const type = document.getElementById('intType').value;
      let config;
      try {
        config = getFormConfig();
      } catch (err) {
        alertEl.textContent = err.message;
        alertEl.classList.add('error');
        alertEl.style.display = 'block';
        return;
      }
      
      try {
        const res = await fetch('/api/admin/forwarding/test', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type, config })
        });
        const data = await res.json();
        if (res.ok && data.ok) {
          alertEl.textContent = 'Pesan uji berhasil dikirim! Silakan periksa aplikasi target Anda.';
          alertEl.classList.add('success');
          alertEl.style.display = 'block';
        } else {
          alertEl.textContent = data.error || 'Gagal mengirim pesan uji.';
          alertEl.classList.add('error');
          alertEl.style.display = 'block';
        }
      } catch (err) {
        alertEl.textContent = 'Gagal menghubungi server.';
        alertEl.classList.add('error');
        alertEl.style.display = 'block';
      }
    }

    // API Settings Submit
    document.getElementById('apiSettingsForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const alertEl = document.getElementById('apiSettingsAlert');
      alertEl.className = 'status-alert';
      alertEl.style.display = 'none';

      const apiSecret = document.getElementById('apiSecretInput').value;

      try {
        const res = await fetch('/api/admin/settings/api-secret', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ api_secret: apiSecret })
        });
        const data = await res.json();
        if (res.ok && data.ok) {
          alertEl.textContent = 'API Secret Token berhasil diperbarui!';
          alertEl.classList.add('success');
          alertEl.style.display = 'block';
          updateCodeSnippets();
        } else {
          alertEl.textContent = data.error || 'Gagal menyimpan API Secret.';
          alertEl.classList.add('error');
        }
      } catch (err) {
        alertEl.textContent = 'Gagal menghubungi server.';
        alertEl.classList.add('error');
      }
    });

    // Credentials Submit
    document.getElementById('settingsForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const alertEl = document.getElementById('settingsAlert');
      alertEl.className = 'status-alert';
      alertEl.style.display = 'none';
      clearFieldErrors('settingsForm');

      const username = document.getElementById('newUsername').value;
      const oldPassword = document.getElementById('oldPassword').value;
      const newPassword = document.getElementById('newPassword').value;
      const confirmPassword = document.getElementById('confirmPassword').value;

      if (newPassword !== confirmPassword) {
        showFieldError('confirmPassword', 'Konfirmasi password baru tidak cocok!');
        document.getElementById('confirmPassword').focus();
        return;
      }

      try {
        const res = await fetch('/api/admin/settings/credentials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, oldPassword, newPassword })
        });
        const data = await res.json();
        if (res.ok && data.ok) {
          alertEl.textContent = 'Kredensial admin berhasil diubah!';
          alertEl.classList.add('success');
          document.getElementById('settingsForm').reset();
          fetchAdminSettings();
        } else {
          alertEl.textContent = data.error || 'Gagal mengubah kredensial.';
          alertEl.classList.add('error');
        }
      } catch (err) {
        alertEl.textContent = 'Gagal menghubungi server.';
        alertEl.classList.add('error');
      }
    });

    let currentCodeTab = 'curl';

    const codeTemplates = {
      curl: (origin, secret) => \`curl -X POST "\${origin}/notify" \\\\
  -H "Content-Type: application/json" \\\\
  -H "X-API-Secret: \${secret}" \\\\
  -d '{
    "source_app": "com.bank.mobile",
    "source_app_label": "Mobile Banking",
    "title": "Transfer Masuk",
    "text": "Transfer Rp50.000 dari BUDI UTOMO berhasil",
    "big_text": "Transfer Rp50.000 dari BUDI UTOMO berhasil pada 06/06 21:50",
    "nominal_raw": "Rp50.000",
    "nominal": 50000,
    "notif_id": 12345,
    "received_at": "\${new Date().toISOString()}"
  }'\`,

      node: (origin, secret) => \`const payload = {
  source_app: "com.bank.mobile",
  source_app_label: "Mobile Banking",
  title: "Transfer Masuk",
  text: "Transfer Rp50.000 dari BUDI UTOMO berhasil",
  big_text: "Transfer Rp50.000 dari BUDI UTOMO berhasil pada 06/06 21:50",
  nominal_raw: "Rp50.000",
  nominal: 50000,
  notif_id: 12345,
  received_at: "\${new Date().toISOString()}"
};

fetch("\${origin}/notify", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-API-Secret": "\${secret}"
  },
  body: JSON.stringify(payload)
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));\`,

      php: (origin, secret) => \`<?php
$payload = [
    "source_app" => "com.bank.mobile",
    "source_app_label" => "Mobile Banking",
    "title" => "Transfer Masuk",
    "text" => "Transfer Rp50.000 dari BUDI UTOMO berhasil",
    "big_text" => "Transfer Rp50.000 dari BUDI UTOMO berhasil pada 06/06 21:50",
    "nominal_raw" => "Rp50.000",
    "nominal" => 50000,
    "notif_id" => 12345,
    "received_at" => "\${new Date().toISOString()}"
];

$ch = curl_init("\${origin}/notify");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "X-API-Secret: \${secret}"
]);

$response = curl_exec($ch);
curl_close($ch);
echo $response;
?>\`,

      python: (origin, secret) => \`import requests

url = "\${origin}/notify"
headers = {
    "Content-Type": "application/json",
    "X-API-Secret": "\${secret}"
}
payload = {
    "source_app": "com.bank.mobile",
    "source_app_label": "Mobile Banking",
    "title": "Transfer Masuk",
    "text": "Transfer Rp50.000 dari BUDI UTOMO berhasil",
    "big_text": "Transfer Rp50.000 dari BUDI UTOMO berhasil pada 06/06 21:50",
    "nominal_raw": "Rp50.000",
    "nominal": 50000,
    "notif_id": 12345,
    "received_at": "\${new Date().toISOString()}"
}

res = requests.post(url, json=payload, headers=headers)
print(res.json())\`,

      dart: (origin, secret) => \`import 'package:dio/dio.dart';

void sendNotification() async {
  var dio = Dio();
  var payload = {
    "source_app": "com.bank.mobile",
    "source_app_label": "Mobile Banking",
    "title": "Transfer Masuk",
    "text": "Transfer Rp50.000 dari BUDI UTOMO berhasil",
    "big_text": "Transfer Rp50.000 dari BUDI UTOMO berhasil pada 06/06 21:50",
    "nominal_raw": "Rp50.000",
    "nominal": 50000,
    "notif_id": 12345,
    "received_at": "\${new Date().toISOString()}"
  };

  try {
    var response = await dio.post(
      '\${origin}/notify',
      data: payload,
      options: Options(
        headers: {
          'Content-Type': 'application/json',
          'X-API-Secret': '\${secret}',
        },
      ),
    );
    print(response.data);
  } catch (e) {
    print(e);
  }
}\`
    };

    function updateCodeSnippets() {
      const origin = window.location.origin;
      const secret = document.getElementById('apiSecretInput').value || '<YOUR_API_SECRET>';
      const previewEl = document.getElementById('codePreview');
      if (previewEl && codeTemplates[currentCodeTab]) {
        previewEl.textContent = codeTemplates[currentCodeTab](origin, secret);
      }
    }

    function switchCodeTab(tabId) {
      currentCodeTab = tabId;
      document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
      document.getElementById('tab-' + tabId).classList.add('active');
      updateCodeSnippets();
    }

    function copySampleCode() {
      const previewEl = document.getElementById('codePreview');
      if (!previewEl) return;

      navigator.clipboard.writeText(previewEl.textContent)
        .then(() => {
          showToast('Kode berhasil disalin ke clipboard!', 'success');
        })
        .catch(err => {
          showToast('Gagal menyalin kode', 'error');
          console.error('Gagal menyalin kode', err);
        });
    }

    // Helpers
    function escapeHtml(text) {
      if (!text) return '';
      return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    function formatDate(isoStr) {
      if (!isoStr) return '-';
      try {
        const d = new Date(isoStr);
        if (isNaN(d.getTime())) return isoStr;
        return d.toLocaleDateString('id-ID', {
          day: '2-digit', month: '2-digit', year: 'numeric'
        }) + ' ' + d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      } catch (e) {
        return isoStr;
      }
    }
  </script>
</body>
</html>`;
