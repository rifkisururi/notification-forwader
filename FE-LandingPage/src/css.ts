export const cssContent = `
:root {
  --bg-main: #0b0f19;
  --bg-card: rgba(17, 24, 39, 0.7);
  --bg-input: rgba(31, 41, 55, 0.5);
  --border-color: rgba(255, 255, 255, 0.08);
  --text-primary: #f3f4f6;
  --text-secondary: #9ca3af;
  --primary: #6366f1;
  --primary-hover: #4f46e5;
  --accent: #a855f7;
  --accent-cyan: #06b6d4;
  --success: #10b981;
  --warning: #f59e0b;
  --danger: #ef4444;
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-display: 'Outfit', var(--font-sans);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background-color: var(--bg-main);
  color: var(--text-primary);
  font-family: var(--font-sans);
  line-height: 1.6;
  overflow-x: hidden;
  background-image: 
    radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.15) 0%, transparent 40%),
    radial-gradient(circle at 90% 80%, rgba(168, 85, 247, 0.15) 0%, transparent 45%);
  background-attachment: fixed;
}

a {
  color: inherit;
  text-decoration: none;
}

/* Header & Navigation */
header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(11, 15, 25, 0.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border-color);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.25rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  background: linear-gradient(135deg, #fff 0%, #a5b4fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.logo-icon {
  width: 2.25rem;
  height: 2.25rem;
  background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

nav ul {
  display: flex;
  list-style: none;
  gap: 2rem;
}

nav a {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text-secondary);
  transition: color 0.2s ease;
}

nav a:hover {
  color: var(--text-primary);
}

.nav-cta {
  background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
  padding: 0.6rem 1.2rem;
  border-radius: 9999px;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.25);
}

.nav-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
}

/* Mobile Nav Toggle */
.menu-btn {
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
}

/* Hero Section */
.hero {
  padding: 10rem 2rem 6rem;
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.hero-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.hero-tag {
  align-self: flex-start;
  background: rgba(99, 102, 241, 0.15);
  border: 1px solid rgba(99, 102, 241, 0.3);
  padding: 0.35rem 0.85rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #a5b4fc;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.hero-title {
  font-family: var(--font-display);
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.03em;
  background: linear-gradient(to right, #ffffff, #c7d2fe, #f472b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-description {
  font-size: 1.125rem;
  color: var(--text-secondary);
}

.hero-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn {
  padding: 0.875rem 1.75rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s ease;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
  color: white;
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.35);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(99, 102, 241, 0.5);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

/* Phone Mockup Section */
.hero-mockup {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.phone {
  width: 290px;
  height: 580px;
  background: #000;
  border-radius: 40px;
  border: 10px solid #1e293b;
  position: relative;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 40px rgba(99, 102, 241, 0.15);
  overflow: hidden;
}

.phone::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 140px;
  height: 25px;
  background: #000;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  z-index: 10;
}

.phone-screen {
  width: 100%;
  height: 100%;
  background: #070a13;
  padding: 35px 15px 15px;
  display: flex;
  flex-direction: column;
  font-family: var(--font-sans);
}

.phone-header {
  color: white;
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  padding: 0 0.5rem 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  margin-bottom: 0.75rem;
}

.phone-title {
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 700;
  text-align: center;
  color: #a5b4fc;
}

.phone-logs {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  overflow-y: hidden;
  position: relative;
}

/* Phone Notifications Mockup */
.mock-notif {
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 0.65rem;
  font-size: 0.72rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  animation: slideInNotif 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.mock-notif-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mock-notif-app {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-weight: 700;
  color: #818cf8;
}

.mock-notif-icon {
  width: 0.95rem;
  height: 0.95rem;
  background: var(--primary);
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.55rem;
}

.mock-notif-time {
  color: var(--text-secondary);
  font-size: 0.65rem;
}

.mock-notif-title {
  font-weight: 700;
  color: white;
}

.mock-notif-body {
  color: var(--text-secondary);
  word-break: break-all;
}

.mock-notif-footer {
  margin-top: 0.25rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-top: 0.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mock-notif-nominal {
  color: #34d399;
  font-weight: 700;
}

.mock-status {
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  font-size: 0.6rem;
  font-weight: 600;
}

.status-sending {
  background: rgba(245, 158, 11, 0.2);
  color: var(--warning);
}

.status-sent {
  background: rgba(16, 185, 129, 0.2);
  color: var(--success);
}

@keyframes slideInNotif {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Features Section (Bento Grid) */
.features-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 6rem 2rem;
}

.section-header {
  text-align: center;
  max-width: 600px;
  margin: 0 auto 4rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-tag {
  align-self: center;
  font-size: 0.8rem;
  font-weight: 600;
  color: #a5b4fc;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.section-title {
  font-family: var(--font-display);
  font-size: 2.5rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.section-subtitle {
  color: var(--text-secondary);
  font-size: 1.05rem;
}

.bento-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.bento-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 1.25rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  transition: transform 0.3s, border-color 0.3s, box-shadow 0.3s;
  position: relative;
  overflow: hidden;
}

.bento-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--primary), var(--accent), transparent);
  opacity: 0;
  transition: opacity 0.3s;
}

.bento-card:hover {
  transform: translateY(-5px);
  border-color: rgba(99, 102, 241, 0.25);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.bento-card:hover::before {
  opacity: 1;
}

.card-icon {
  width: 3rem;
  height: 3rem;
  background: rgba(99, 102, 241, 0.1);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a5b4fc;
  font-size: 1.5rem;
}

.bento-card.large {
  grid-column: span 2;
}

.card-title {
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 700;
  color: white;
}

.card-desc {
  color: var(--text-secondary);
  font-size: 0.95rem;
}

/* API Playground Section */
.playground-section {
  background: rgba(17, 24, 39, 0.4);
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
  padding: 6rem 2rem;
}

.playground-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 4rem;
  align-items: center;
}

.playground-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.playground-code {
  background: #05070f;
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.code-header {
  background: rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid var(--border-color);
  padding: 0.75rem 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.code-dots {
  display: flex;
  gap: 0.35rem;
}

.code-dot {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
}
.dot-red { background: #ef4444; }
.dot-yellow { background: #f59e0b; }
.dot-green { background: #10b981; }

.code-tabs {
  display: flex;
  list-style: none;
}

.code-tab {
  padding: 0.4rem 0.85rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
}

.code-tab.active {
  color: white;
  background: rgba(255, 255, 255, 0.05);
}

.code-body {
  padding: 1.5rem;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.9rem;
  line-height: 1.5;
  color: #a5b4fc;
  overflow-x: auto;
}

/* Syntax Coloring */
.json-key { color: #f472b6; }
.json-string { color: #34d399; }
.json-number { color: #38bdf8; }
.json-boolean { color: #fbbf24; }

/* Guide Section (Accordion) */
.guide-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 6rem 2rem;
}

.accordion {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.accordion-item {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  overflow: hidden;
  transition: all 0.3s;
}

.accordion-header {
  padding: 1.25rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 700;
  user-select: none;
}

.accordion-icon {
  font-size: 1.25rem;
  color: var(--text-secondary);
  transition: transform 0.3s;
}

.accordion-content {
  padding: 0 1.5rem;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease, padding 0.3s ease;
  color: var(--text-secondary);
  font-size: 0.95rem;
  border-top: 1px solid transparent;
}

.accordion-item.active {
  border-color: rgba(99, 102, 241, 0.2);
}

.accordion-item.active .accordion-icon {
  transform: rotate(180deg);
}

.accordion-item.active .accordion-content {
  padding: 1.25rem 1.5rem;
  max-height: 500px;
  border-top-color: var(--border-color);
}

.guide-step-list {
  padding-left: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.guide-step-list li strong {
  color: white;
}

/* Call to Action Banner */
.cta-section {
  max-width: 1200px;
  margin: 4rem auto 6rem;
  padding: 0 2rem;
}

.cta-banner {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.8) 0%, rgba(168, 85, 247, 0.8) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 2rem;
  padding: 4rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 20px 50px rgba(99, 102, 241, 0.25);
  position: relative;
  overflow: hidden;
}

.cta-banner::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.cta-title {
  font-family: var(--font-display);
  font-size: 2.75rem;
  font-weight: 800;
  color: white;
  line-height: 1.2;
}

.cta-desc {
  max-width: 600px;
  color: #e0e7ff;
  font-size: 1.1rem;
}

.cta-banner .btn-primary {
  background: white;
  color: var(--primary);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.cta-banner .btn-primary:hover {
  background: #f3f4f6;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);
  color: var(--primary-hover);
}

/* Footer */
footer {
  border-top: 1px solid var(--border-color);
  background: rgba(11, 15, 25, 0.8);
  padding: 4rem 2rem 2rem;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.footer-top {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 2rem;
}

.footer-brand {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 300px;
}

.footer-desc {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.footer-links {
  display: flex;
  gap: 6rem;
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footer-col-title {
  font-family: var(--font-display);
  font-size: 0.95rem;
  font-weight: 700;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.footer-col ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.footer-col a {
  font-size: 0.9rem;
  color: var(--text-secondary);
  transition: color 0.2s;
}

.footer-col a:hover {
  color: white;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-top: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

/* Responsive Breakpoints */
@media (max-width: 1024px) {
  .hero {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 3rem;
    padding-top: 8rem;
  }
  .hero-content {
    align-items: center;
  }
  .hero-title {
    font-size: 3rem;
  }
  .bento-grid {
    grid-template-columns: 1fr 1fr;
  }
  .bento-card.large {
    grid-column: span 1;
  }
  .playground-container {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
}

@media (max-width: 768px) {
  nav {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: #0f172a;
    border-bottom: 1px solid var(--border-color);
    padding: 1.5rem 2rem;
  }
  nav.active {
    display: block;
  }
  nav ul {
    flex-direction: column;
    gap: 1.25rem;
  }
  .menu-btn {
    display: block;
  }
  .hero-title {
    font-size: 2.5rem;
  }
  .bento-grid {
    grid-template-columns: 1fr;
  }
  .footer-links {
    gap: 3rem;
    flex-wrap: wrap;
  }
  .cta-banner {
    padding: 2.5rem 1.5rem;
  }
  .cta-title {
    font-size: 2rem;
  }
}
`;
