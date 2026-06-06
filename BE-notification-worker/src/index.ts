import { loginHtml, dashboardHtml } from "./ui";

interface Env {
  DB: D1Database;
  CONFIG: KVNamespace;
  API_SECRET: string;
  ENVIRONMENT: string;
}

interface NotificationPayload {
  source_app: string;
  source_app_label?: string;
  title?: string;
  text?: string;
  big_text?: string;
  nominal_raw?: string;
  nominal?: number;
  notif_id?: number;
  received_at?: string;
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-API-Secret",
  "Access-Control-Max-Age": "86400",
};

function jsonResponse(data: any, status: number = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...CORS_HEADERS,
      ...headers,
    },
  });
}

function handleOptions(): Response {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

async function getApiSecret(db: D1Database, env: Env): Promise<string> {
  try {
    const row = await db.prepare("SELECT value FROM admin_settings WHERE key = 'api_secret'").first<{ value: string }>();
    if (row && row.value) {
      return row.value;
    }
  } catch (e) {
    // Table might not exist or be empty
  }
  return env.API_SECRET || "mysecrettoken123";
}

async function isAuthorized(request: Request, env: Env): Promise<boolean> {
  const secret = request.headers.get("X-API-Secret");
  if (!secret) return false;
  const expectedSecret = await getApiSecret(env.DB, env);
  return secret === expectedSecret;
}

function parseCookies(request: Request): Record<string, string> {
  const cookieHeader = request.headers.get("Cookie");
  const cookies: Record<string, string> = {};
  if (cookieHeader) {
    cookieHeader.split(";").forEach((cookie) => {
      const parts = cookie.split("=");
      if (parts.length === 2) {
        cookies[parts[0].trim()] = parts[1].trim();
      }
    });
  }
  return cookies;
}

async function getActiveSession(request: Request, env: Env): Promise<string | null> {
  const cookies = parseCookies(request);
  const sessionToken = cookies["session"];
  if (!sessionToken) return null;
  const username = await env.CONFIG.get(`session:${sessionToken}`);
  return username;
}

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

async function getAdminCredentials(db: D1Database): Promise<{ username: string; passwordHash: string }> {
  try {
    const usernameRow = await db.prepare("SELECT value FROM admin_settings WHERE key = 'admin_username'").first<{ value: string }>();
    const passwordHashRow = await db.prepare("SELECT value FROM admin_settings WHERE key = 'admin_password_hash'").first<{ value: string }>();

    if (!usernameRow || !passwordHashRow) {
      const defaultUsername = "admin";
      const defaultHash = "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92"; // Hash of "123456"
      await db.prepare("INSERT OR REPLACE INTO admin_settings (key, value) VALUES ('admin_username', ?)").bind(defaultUsername).run();
      await db.prepare("INSERT OR REPLACE INTO admin_settings (key, value) VALUES ('admin_password_hash', ?)").bind(defaultHash).run();
      return { username: defaultUsername, passwordHash: defaultHash };
    }

    return { username: usernameRow.value, passwordHash: passwordHashRow.value };
  } catch (err) {
    return {
      username: "admin",
      passwordHash: "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
    };
  }
}

// ==========================================
// Notification Forwarding Logic (Third-party integrations)
// ==========================================

async function testForwardingRule(type: string, config: string, payload: any) {
  let configObj: any;
  try {
    configObj = typeof config === "string" ? JSON.parse(config) : config;
  } catch (e) {
    throw new Error("Format konfigurasi tidak valid JSON");
  }

  const appLabel = payload.source_app_label || payload.source_app;
  let nominalText = "-";
  if (payload.nominal !== null && payload.nominal !== undefined) {
    nominalText = "Rp " + Number(payload.nominal).toLocaleString("id-ID");
  } else if (payload.nominal_raw) {
    nominalText = payload.nominal_raw;
  }

  if (type === "telegram") {
    const botToken = configObj.bot_token;
    const chatId = configObj.chat_id;
    if (!botToken || !chatId) {
      throw new Error("Bot Token dan Chat ID wajib diisi");
    }
    const text = `🔔 *Tes Notifikasi Pembayaran*\n\n` +
                 `📱 *Aplikasi:* ${appLabel} (${payload.source_app})\n` +
                 `👤 *Judul:* ${payload.title}\n` +
                 `💬 *Pesan:* ${payload.text}\n` +
                 `💰 *Nominal:* ${nominalText}\n` +
                 `⏰ *Waktu:* ${payload.received_at}`;
    
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: "Markdown",
      }),
    });
    const data: any = await res.json();
    if (!res.ok || !data.ok) {
      throw new Error(data.description || "Gagal mengirim ke Telegram API");
    }
  } else if (type === "discord") {
    const webhookUrl = configObj.webhook_url;
    if (!webhookUrl) {
      throw new Error("Discord Webhook URL wajib diisi");
    }
    const discordPayload = {
      embeds: [
        {
          title: "🔔 Tes Notifikasi Pembayaran",
          color: 6516977,
          fields: [
            { name: "Aplikasi", value: `${appLabel} (${payload.source_app})`, inline: true },
            { name: "Nominal", value: nominalText, inline: true },
            { name: "Judul", value: payload.title, inline: false },
            { name: "Pesan", value: payload.text, inline: false },
            { name: "Status", value: "Sukses (Tes Koneksi)", inline: true },
          ],
          timestamp: new Date().toISOString(),
        },
      ],
    };
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(discordPayload),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Gagal mengirim ke Discord Webhook");
    }
  } else if (type === "custom") {
    const customUrl = configObj.custom_url;
    if (!customUrl) {
      throw new Error("Webhook Target URL wajib diisi");
    }
    let customHeaders: Record<string, string> = { "Content-Type": "application/json" };
    if (configObj.custom_headers) {
      try {
        const parsedHeaders = typeof configObj.custom_headers === "string" 
          ? JSON.parse(configObj.custom_headers) 
          : configObj.custom_headers;
        customHeaders = { ...customHeaders, ...parsedHeaders };
      } catch (e) {
        throw new Error("Format Custom Headers tidak valid JSON");
      }
    }
    const res = await fetch(customUrl, {
      method: "POST",
      headers: customHeaders,
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status}: ${text || "Gagal mengirim payload"}`);
    }
  } else if (type === "wa_official") {
    const accessToken = configObj.access_token;
    const phoneNumberId = configObj.phone_number_id;
    const recipientPhone = configObj.recipient_phone;
    if (!accessToken || !phoneNumberId || !recipientPhone) {
      throw new Error("Token Akses, ID Nomor Telepon, dan Nomor Penerima wajib diisi");
    }
    const text = `🔔 *Tes Notifikasi Pembayaran*\n\n` +
                 `*Aplikasi:* ${appLabel} (${payload.source_app})\n` +
                 `*Judul:* ${payload.title}\n` +
                 `*Pesan:* ${payload.text}\n` +
                 `*Nominal:* ${nominalText}\n` +
                 `*Status:* Sukses (Tes Koneksi)\n` +
                 `*Waktu:* ${payload.received_at}`;
                 
    const res = await fetch(`https://graph.facebook.com/v20.0/${phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: recipientPhone,
        type: "text",
        text: {
          preview_url: false,
          body: text
        }
      })
    });
    
    if (!res.ok) {
      const errText = await res.text();
      let errMsg = errText;
      try {
        const errJson = JSON.parse(errText);
        if (errJson.error && errJson.error.message) {
          errMsg = errJson.error.message;
        }
      } catch (e) {}
      throw new Error(`WhatsApp API Error: ${errMsg}`);
    }
  } else {
    throw new Error("Tipe integrasi tidak dikenal");
  }
}

async function performForwarding(payload: any, db: D1Database) {
  let rulesResult;
  try {
    rulesResult = await db.prepare("SELECT id, name, type, config FROM forwarding_rules WHERE enabled = 1").all<{ id: string; name: string; type: string; config: string }>();
  } catch (e) {
    console.error("Failed to query forwarding rules", e);
    return;
  }

  const rules = rulesResult.results || [];
  if (rules.length === 0) return;

  const appLabel = payload.source_app_label || payload.source_app;
  let nominalText = "-";
  if (payload.nominal !== null && payload.nominal !== undefined) {
    nominalText = "Rp " + Number(payload.nominal).toLocaleString("id-ID");
  } else if (payload.nominal_raw) {
    nominalText = payload.nominal_raw;
  }

  const promises = rules.map(async (rule) => {
    let configObj: any;
    try {
      configObj = typeof rule.config === "string" ? JSON.parse(rule.config) : rule.config;
    } catch (e) {
      console.error(`Invalid JSON config for rule ${rule.name} (${rule.id}):`, e);
      return;
    }

    try {
      if (rule.type === "telegram") {
        const botToken = configObj.bot_token;
        const chatId = configObj.chat_id;
        if (botToken && chatId) {
          const text = `🔔 *Notifikasi Pembayaran Baru*\n\n` +
                       `📱 *Aplikasi:* ${appLabel} (${payload.source_app})\n` +
                       `👤 *Judul:* ${payload.title || "-"}\n` +
                       `💬 *Pesan:* ${payload.text || "-"}\n` +
                       `💰 *Nominal:* ${nominalText}\n` +
                       `⏰ *Waktu:* ${payload.received_at || "-"}`;
          const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: chatId,
              text: text,
              parse_mode: "Markdown",
            }),
          });
          if (!res.ok) {
            console.error(`Telegram forwarding failed for ${rule.name}: ${res.status} ${await res.text()}`);
          }
        }
      } else if (rule.type === "discord") {
        const webhookUrl = configObj.webhook_url;
        if (webhookUrl) {
          const discordPayload = {
            embeds: [
              {
                title: "🔔 Notifikasi Pembayaran Baru",
                color: 6516977, // Indigo #6366F1
                fields: [
                  { name: "Aplikasi", value: `${appLabel} (${payload.source_app})`, inline: true },
                  { name: "Nominal", value: nominalText, inline: true },
                  { name: "Judul", value: payload.title || "-", inline: false },
                  { name: "Pesan", value: payload.text || "-", inline: false },
                  { name: "Waktu Device", value: payload.received_at || "-", inline: true },
                ],
                timestamp: new Date().toISOString(),
              },
            ],
          };
          const res = await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(discordPayload),
          });
          if (!res.ok) {
            console.error(`Discord forwarding failed for ${rule.name}: ${res.status} ${await res.text()}`);
          }
        }
      } else if (rule.type === "custom") {
        const customUrl = configObj.custom_url;
        if (customUrl) {
          let customHeaders: Record<string, string> = { "Content-Type": "application/json" };
          if (configObj.custom_headers) {
            try {
              const parsedHeaders = typeof configObj.custom_headers === "string" 
                ? JSON.parse(configObj.custom_headers) 
                : configObj.custom_headers;
              customHeaders = { ...customHeaders, ...parsedHeaders };
            } catch (e) {
              // ignore
            }
          }
          const res = await fetch(customUrl, {
            method: "POST",
            headers: customHeaders,
            body: JSON.stringify(payload),
          });
          if (!res.ok) {
            console.error(`Custom Webhook forwarding failed for ${rule.name}: ${res.status} ${await res.text()}`);
          }
        }
      } else if (rule.type === "wa_official") {
        const accessToken = configObj.access_token;
        const phoneNumberId = configObj.phone_number_id;
        const recipientPhone = configObj.recipient_phone;
        if (accessToken && phoneNumberId && recipientPhone) {
          const text = `🔔 *Notifikasi Pembayaran Baru*\n\n` +
                       `*Aplikasi:* ${appLabel} (${payload.source_app})\n` +
                       `*Judul:* ${payload.title || "-"}\n` +
                       `*Pesan:* ${payload.text || "-"}\n` +
                       `*Nominal:* ${nominalText}\n` +
                       `*Waktu:* ${payload.received_at || "-"}`;
                       
          const res = await fetch(`https://graph.facebook.com/v20.0/${phoneNumberId}/messages`, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${accessToken}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              messaging_product: "whatsapp",
              recipient_type: "individual",
              to: recipientPhone,
              type: "text",
              text: {
                preview_url: false,
                body: text
              }
            })
          });
          if (!res.ok) {
            console.error(`WhatsApp forwarding failed for ${rule.name}: ${res.status} ${await res.text()}`);
          }
        }
      }
    } catch (err) {
      console.error(`Error executing forwarding rule ${rule.name}:`, err);
    }
  });

  await Promise.all(promises);
}

function handleHealth(): Response {
  return jsonResponse({
    ok: true,
    timestamp: new Date().toISOString(),
  });
}

async function handleNotify(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  if (!(await isAuthorized(request, env))) {
    return jsonResponse({ ok: false, error: "Unauthorized" }, 401);
  }

  let payload: any;
  try {
    payload = await request.json();
  } catch (err) {
    return jsonResponse({ ok: false, error: "Invalid payload" }, 400);
  }

  if (!payload || typeof payload !== "object") {
    return jsonResponse({ ok: false, error: "Invalid payload" }, 400);
  }

  const {
    source_app,
    source_app_label,
    title,
    text,
    big_text,
    nominal_raw,
    nominal,
    notif_id,
    received_at,
  } = payload as NotificationPayload;

  // Validate required field: source_app must be present and a string
  if (!source_app || typeof source_app !== "string") {
    return jsonResponse({ ok: false, error: "Invalid payload" }, 400);
  }

  const id = crypto.randomUUID();
  const serverTime = new Date().toISOString();

  // nominal must be a number or null. If nominal is present but not a number, store as NULL, do not reject
  let parsedNominal: number | null = null;
  if (nominal !== undefined && nominal !== null) {
    if (typeof nominal === "number" && !isNaN(nominal)) {
      parsedNominal = nominal;
    } else if (typeof nominal === "string") {
      const num = Number(nominal);
      if (!isNaN(num)) {
        parsedNominal = num;
      }
    }
  }

  // Parse notif_id safely if present
  let parsedNotifId: number | null = null;
  if (notif_id !== undefined && notif_id !== null) {
    if (typeof notif_id === "number" && !isNaN(notif_id)) {
      parsedNotifId = notif_id;
    } else if (typeof notif_id === "string") {
      const num = parseInt(notif_id, 10);
      if (!isNaN(num)) {
        parsedNotifId = num;
      }
    }
  }

  // received_at default to serverTime if empty or not a string
  const finalReceivedAt = (received_at && typeof received_at === "string" && received_at.trim() !== "")
    ? received_at
    : serverTime;

  // Insert into D1
  try {
    await env.DB.prepare(
      `INSERT INTO notifications (
        id, source_app, source_app_label, title, text, big_text, nominal_raw, nominal, notif_id, received_at, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      id,
      source_app,
      (typeof source_app_label === "string") ? source_app_label : null,
      (typeof title === "string") ? title : null,
      (typeof text === "string") ? text : null,
      (typeof big_text === "string") ? big_text : null,
      (typeof nominal_raw === "string") ? nominal_raw : null,
      parsedNominal,
      parsedNotifId,
      finalReceivedAt,
      serverTime
    ).run();
  } catch (err: any) {
    return jsonResponse({ ok: false, error: err.message || "Failed to save notification" }, 500);
  }

  // Trigger forwarding asynchronously in the background via ctx.waitUntil
  const forwardPayload = {
    id,
    source_app,
    source_app_label,
    title,
    text,
    big_text,
    nominal_raw,
    nominal: parsedNominal,
    notif_id: parsedNotifId,
    received_at: finalReceivedAt,
    created_at: serverTime,
  };
  ctx.waitUntil(performForwarding(forwardPayload, env.DB));

  return jsonResponse({ ok: true, id });
}

async function handleList(request: Request, env: Env): Promise<Response> {
  if (!(await isAuthorized(request, env))) {
    return jsonResponse({ ok: false, error: "Unauthorized" }, 401);
  }

  const url = new URL(request.url);
  const limitStr = url.searchParams.get("limit");
  const offsetStr = url.searchParams.get("offset");
  const sourceAppParam = url.searchParams.get("source_app");

  let limit = 50;
  if (limitStr) {
    const parsedLimit = parseInt(limitStr, 10);
    if (!isNaN(parsedLimit)) {
      limit = Math.min(Math.max(parsedLimit, 1), 200);
    }
  }

  let offset = 0;
  if (offsetStr) {
    const parsedOffset = parseInt(offsetStr, 10);
    if (!isNaN(parsedOffset)) {
      offset = Math.max(parsedOffset, 0);
    }
  }

  let countQuery = "SELECT COUNT(*) as total FROM notifications";
  let dataQuery = "SELECT id, source_app, source_app_label, title, text, nominal, received_at, created_at FROM notifications";
  let whereClause = "";
  const params: any[] = [];

  if (sourceAppParam && sourceAppParam.trim() !== "") {
    whereClause = " WHERE source_app = ?";
    params.push(sourceAppParam.trim());
  }

  countQuery += whereClause;
  dataQuery += whereClause + " ORDER BY created_at DESC LIMIT ? OFFSET ?";

  const dataParams = [...params, limit, offset];

  try {
    const countResult = await env.DB.prepare(countQuery).bind(...params).first<{ total: number }>();
    const total = countResult?.total || 0;

    const dataResult = await env.DB.prepare(dataQuery).bind(...dataParams).all();
    const data = dataResult.results || [];

    return jsonResponse({
      ok: true,
      total,
      data,
    });
  } catch (err: any) {
    return jsonResponse({ ok: false, error: err.message || "Failed to retrieve notifications" }, 500);
  }
}

// ==========================================
// Web Dashboard & Session Handlers
// ==========================================

async function handleWebLogin(request: Request, env: Env): Promise<Response> {
  const username = await getActiveSession(request, env);
  if (username) {
    return Response.redirect(new URL("/dashboard", request.url).toString(), 302);
  }

  return new Response(loginHtml, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

async function handleWebDashboard(request: Request, env: Env): Promise<Response> {
  const username = await getActiveSession(request, env);
  if (!username) {
    return Response.redirect(new URL("/login", request.url).toString(), 302);
  }

  return new Response(dashboardHtml, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

async function handleApiAuthLogin(request: Request, env: Env): Promise<Response> {
  let body: any;
  try {
    body = await request.json();
  } catch (e) {
    return jsonResponse({ ok: false, error: "Invalid request payload" }, 400);
  }

  const { username, password } = body;
  if (!username || !password) {
    return jsonResponse({ ok: false, error: "Username dan password wajib diisi" }, 400);
  }

  const credentials = await getAdminCredentials(env.DB);

  if (username !== credentials.username) {
    return jsonResponse({ ok: false, error: "Username atau password salah" }, 401);
  }

  const inputHash = await sha256(password);
  if (inputHash !== credentials.passwordHash) {
    return jsonResponse({ ok: false, error: "Username atau password salah" }, 401);
  }

  const sessionToken = crypto.randomUUID();
  // Store session in KV for 7 days
  await env.CONFIG.put(`session:${sessionToken}`, username, { expirationTtl: 604800 });

  return jsonResponse(
    { ok: true },
    200,
    {
      "Set-Cookie": `session=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`,
    }
  );
}

async function handleApiAuthLogout(request: Request, env: Env): Promise<Response> {
  const cookies = parseCookies(request);
  const sessionToken = cookies["session"];
  if (sessionToken) {
    await env.CONFIG.delete(`session:${sessionToken}`);
  }

  return jsonResponse(
    { ok: true },
    200,
    {
      "Set-Cookie": "session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0",
    }
  );
}

// GET /api/admin/settings -> returns settings info + forwarding config
async function handleGetApiAdminSettings(request: Request, env: Env): Promise<Response> {
  const username = await getActiveSession(request, env);
  if (!username) {
    return jsonResponse({ ok: false, error: "Unauthorized" }, 401);
  }

  const apiSecret = await getApiSecret(env.DB, env);

  // Fetch all forwarding settings
  let settings;
  try {
    settings = await env.DB.prepare("SELECT key, value FROM admin_settings WHERE key LIKE 'forward_%'").all<{ key: string; value: string }>();
  } catch (e) {
    settings = { results: [] };
  }

  const forwarding: Record<string, string> = {
    telegram_enabled: "false",
    telegram_bot_token: "",
    telegram_chat_id: "",
    discord_enabled: "false",
    discord_webhook_url: "",
    custom_enabled: "false",
    custom_url: "",
    custom_headers: "",
  };

  if (settings.results) {
    settings.results.forEach((row) => {
      const shortKey = row.key.replace("forward_", "");
      forwarding[shortKey] = row.value;
    });
  }

  return jsonResponse({
    ok: true,
    username,
    api_secret: apiSecret,
    forwarding,
  });
}

// POST /api/admin/settings/api-secret -> updates api secret
async function handlePostApiAdminSettingsApiSecret(request: Request, env: Env): Promise<Response> {
  const username = await getActiveSession(request, env);
  if (!username) {
    return jsonResponse({ ok: false, error: "Unauthorized" }, 401);
  }

  let body: any;
  try {
    body = await request.json();
  } catch (e) {
    return jsonResponse({ ok: false, error: "Invalid request payload" }, 400);
  }

  const { api_secret } = body;
  if (api_secret === undefined || api_secret.trim() === "") {
    return jsonResponse({ ok: false, error: "API Secret tidak boleh kosong" }, 400);
  }

  try {
    await env.DB.prepare("INSERT OR REPLACE INTO admin_settings (key, value) VALUES ('api_secret', ?)").bind(api_secret.trim()).run();
  } catch (err: any) {
    return jsonResponse({ ok: false, error: err.message || "Gagal menyimpan API Secret" }, 500);
  }

  return jsonResponse({ ok: true });
}

// POST /api/admin/settings/credentials -> updates username and password
async function handlePostApiAdminSettingsCredentials(request: Request, env: Env): Promise<Response> {
  const currentUsername = await getActiveSession(request, env);
  if (!currentUsername) {
    return jsonResponse({ ok: false, error: "Unauthorized" }, 401);
  }

  let body: any;
  try {
    body = await request.json();
  } catch (e) {
    return jsonResponse({ ok: false, error: "Invalid request payload" }, 400);
  }

  const { username, oldPassword, newPassword } = body;
  if (!username || !oldPassword || !newPassword) {
    return jsonResponse({ ok: false, error: "Semua field wajib diisi" }, 400);
  }

  if (username.trim() === "" || newPassword.trim() === "") {
    return jsonResponse({ ok: false, error: "Username atau password baru tidak boleh kosong" }, 400);
  }

  const credentials = await getAdminCredentials(env.DB);
  const oldHash = await sha256(oldPassword);

  if (oldHash !== credentials.passwordHash) {
    return jsonResponse({ ok: false, error: "Password saat ini salah" }, 400);
  }

  const newHash = await sha256(newPassword);

  try {
    await env.DB.prepare("INSERT OR REPLACE INTO admin_settings (key, value) VALUES ('admin_username', ?)").bind(username.trim()).run();
    await env.DB.prepare("INSERT OR REPLACE INTO admin_settings (key, value) VALUES ('admin_password_hash', ?)").bind(newHash).run();
  } catch (err: any) {
    return jsonResponse({ ok: false, error: err.message || "Gagal memperbarui kredensial" }, 500);
  }

  // Refresh user session in KV if name changed
  const cookies = parseCookies(request);
  const sessionToken = cookies["session"];
  if (sessionToken) {
    await env.CONFIG.put(`session:${sessionToken}`, username.trim(), { expirationTtl: 604800 });
  }

  return jsonResponse({ ok: true });
}

// GET /api/admin/forwarding
async function handleGetApiAdminForwarding(request: Request, env: Env): Promise<Response> {
  const username = await getActiveSession(request, env);
  if (!username) {
    return jsonResponse({ ok: false, error: "Unauthorized" }, 401);
  }

  try {
    const result = await env.DB.prepare(
      "SELECT id, name, type, enabled, config, created_at FROM forwarding_rules ORDER BY created_at DESC"
    ).all<{ id: string; name: string; type: string; enabled: number; config: string; created_at: string }>();
    return jsonResponse({ ok: true, rules: result.results || [] });
  } catch (err: any) {
    return jsonResponse({ ok: false, error: err.message || "Failed to retrieve forwarding rules" }, 500);
  }
}

// POST /api/admin/forwarding
async function handlePostApiAdminForwarding(request: Request, env: Env): Promise<Response> {
  const username = await getActiveSession(request, env);
  if (!username) {
    return jsonResponse({ ok: false, error: "Unauthorized" }, 401);
  }

  let body: any;
  try {
    body = await request.json();
  } catch (e) {
    return jsonResponse({ ok: false, error: "Invalid request payload" }, 400);
  }

  const { id, name, type, config, enabled } = body;
  if (!name || !type || !config) {
    return jsonResponse({ ok: false, error: "Nama, tipe, dan konfigurasi wajib diisi" }, 400);
  }

  if (name.trim() === "") {
    return jsonResponse({ ok: false, error: "Nama integrasi tidak boleh kosong" }, 400);
  }

  const validTypes = ["telegram", "discord", "custom", "wa_official"];
  if (!validTypes.includes(type)) {
    return jsonResponse({ ok: false, error: "Tipe integrasi tidak valid" }, 400);
  }

  let configStr = "";
  if (typeof config === "string") {
    configStr = config;
  } else {
    configStr = JSON.stringify(config);
  }

  // Basic validation of config JSON
  try {
    JSON.parse(configStr);
  } catch (e) {
    return jsonResponse({ ok: false, error: "Format konfigurasi tidak valid JSON" }, 400);
  }

  const isEnabled = enabled === 1 || enabled === true || enabled === "1" ? 1 : 0;
  const targetId = id || crypto.randomUUID();
  const serverTime = new Date().toISOString();

  try {
    if (id) {
      // Update existing
      await env.DB.prepare(
        "UPDATE forwarding_rules SET name = ?, type = ?, config = ?, enabled = ? WHERE id = ?"
      ).bind(name.trim(), type, configStr, isEnabled, id).run();
    } else {
      // Insert new
      await env.DB.prepare(
        "INSERT INTO forwarding_rules (id, name, type, enabled, config, created_at) VALUES (?, ?, ?, ?, ?, ?)"
      ).bind(targetId, name.trim(), type, isEnabled, configStr, serverTime).run();
    }
    return jsonResponse({ ok: true, id: targetId });
  } catch (err: any) {
    return jsonResponse({ ok: false, error: err.message || "Gagal menyimpan integrasi" }, 500);
  }
}

// POST /api/admin/forwarding/toggle
async function handlePostApiAdminForwardingToggle(request: Request, env: Env): Promise<Response> {
  const username = await getActiveSession(request, env);
  if (!username) {
    return jsonResponse({ ok: false, error: "Unauthorized" }, 401);
  }

  let body: any;
  try {
    body = await request.json();
  } catch (e) {
    return jsonResponse({ ok: false, error: "Invalid request payload" }, 400);
  }

  const { id, enabled } = body;
  if (!id) {
    return jsonResponse({ ok: false, error: "ID integrasi wajib disertakan" }, 400);
  }

  const isEnabled = enabled === 1 || enabled === true || enabled === "1" ? 1 : 0;

  try {
    await env.DB.prepare(
      "UPDATE forwarding_rules SET enabled = ? WHERE id = ?"
    ).bind(isEnabled, id).run();
    return jsonResponse({ ok: true });
  } catch (err: any) {
    return jsonResponse({ ok: false, error: err.message || "Gagal mengubah status integrasi" }, 500);
  }
}

// POST /api/admin/forwarding/delete
async function handlePostApiAdminForwardingDelete(request: Request, env: Env): Promise<Response> {
  const username = await getActiveSession(request, env);
  if (!username) {
    return jsonResponse({ ok: false, error: "Unauthorized" }, 401);
  }

  let body: any;
  try {
    body = await request.json();
  } catch (e) {
    return jsonResponse({ ok: false, error: "Invalid request payload" }, 400);
  }

  const { id } = body;
  if (!id) {
    return jsonResponse({ ok: false, error: "ID integrasi wajib disertakan" }, 400);
  }

  try {
    await env.DB.prepare("DELETE FROM forwarding_rules WHERE id = ?").bind(id).run();
    return jsonResponse({ ok: true });
  } catch (err: any) {
    return jsonResponse({ ok: false, error: err.message || "Gagal menghapus integrasi" }, 500);
  }
}

// POST /api/admin/forwarding/test
async function handlePostApiAdminForwardingTest(request: Request, env: Env): Promise<Response> {
  const username = await getActiveSession(request, env);
  if (!username) {
    return jsonResponse({ ok: false, error: "Unauthorized" }, 401);
  }

  let body: any;
  try {
    body = await request.json();
  } catch (e) {
    return jsonResponse({ ok: false, error: "Invalid request payload" }, 400);
  }

  const { type, config } = body;
  if (!type || !config) {
    return jsonResponse({ ok: false, error: "Tipe dan konfigurasi wajib disertakan untuk testing" }, 400);
  }

  const mockPayload = {
    id: "test-uuid-12345-67890",
    source_app: "id.co.bri.merchant",
    source_app_label: "BRImerchant (TEST)",
    title: "Pembayaran Diterima (TEST)",
    text: "QRIS Rp75.000 dari SITI AMINAH berhasil (TEST)",
    big_text: "Transaksi uji coba pengiriman notifikasi berhasil disimulasikan.",
    nominal_raw: "Rp75.000",
    nominal: 75000,
    received_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  };

  let configStr = typeof config === "string" ? config : JSON.stringify(config);

  try {
    await testForwardingRule(type, configStr, mockPayload);
    return jsonResponse({ ok: true });
  } catch (err: any) {
    return jsonResponse({ ok: false, error: err.message || "Gagal melakukan tes integrasi" }, 500);
  }
}

async function handleApiAdminStats(request: Request, env: Env): Promise<Response> {
  const username = await getActiveSession(request, env);
  if (!username) {
    return jsonResponse({ ok: false, error: "Unauthorized" }, 401);
  }

  try {
    // Total notifications count
    const totalResult = await env.DB.prepare("SELECT COUNT(*) as total FROM notifications").first<{ total: number }>();
    const total = totalResult?.total || 0;

    // Notifications today count (server time)
    const todayPrefix = new Date().toISOString().split("T")[0] + "%";
    const todayResult = await env.DB.prepare("SELECT COUNT(*) as today FROM notifications WHERE created_at LIKE ?").bind(todayPrefix).first<{ today: number }>();
    const today = todayResult?.today || 0;

    // Count with nominal parsed
    const nominalResult = await env.DB.prepare("SELECT COUNT(*) as nominal_count FROM notifications WHERE nominal IS NOT NULL").first<{ nominal_count: number }>();
    const withNominal = nominalResult?.nominal_count || 0;

    // Count unique source apps
    const appsResult = await env.DB.prepare("SELECT COUNT(DISTINCT source_app) as app_count FROM notifications").first<{ app_count: number }>();
    const uniqueApps = appsResult?.app_count || 0;

    return jsonResponse({
      ok: true,
      username,
      stats: {
        total,
        today,
        with_nominal: withNominal,
        unique_apps: uniqueApps,
      },
    });
  } catch (err: any) {
    return jsonResponse({ ok: false, error: err.message || "Failed to retrieve stats" }, 500);
  }
}

async function handleApiAdminNotifications(request: Request, env: Env): Promise<Response> {
  const username = await getActiveSession(request, env);
  if (!username) {
    return jsonResponse({ ok: false, error: "Unauthorized" }, 401);
  }

  const url = new URL(request.url);
  const limitStr = url.searchParams.get("limit");
  const offsetStr = url.searchParams.get("offset");
  const sourceAppParam = url.searchParams.get("source_app");
  const searchParam = url.searchParams.get("search");

  let limit = 50;
  if (limitStr) {
    const parsedLimit = parseInt(limitStr, 10);
    if (!isNaN(parsedLimit)) {
      limit = Math.min(Math.max(parsedLimit, 1), 200);
    }
  }

  let offset = 0;
  if (offsetStr) {
    const parsedOffset = parseInt(offsetStr, 10);
    if (!isNaN(parsedOffset)) {
      offset = Math.max(parsedOffset, 0);
    }
  }

  let countQuery = "SELECT COUNT(*) as total FROM notifications";
  let dataQuery = "SELECT id, source_app, source_app_label, title, text, big_text, nominal_raw, nominal, notif_id, received_at, created_at FROM notifications";
  
  const whereConditions: string[] = [];
  const params: any[] = [];

  if (sourceAppParam && sourceAppParam.trim() !== "") {
    whereConditions.push("source_app = ?");
    params.push(sourceAppParam.trim());
  }

  if (searchParam && searchParam.trim() !== "") {
    whereConditions.push("(title LIKE ? OR text LIKE ? OR source_app_label LIKE ? OR nominal_raw LIKE ?)");
    const likeVal = `%${searchParam.trim()}%`;
    params.push(likeVal, likeVal, likeVal, likeVal);
  }

  let whereClause = "";
  if (whereConditions.length > 0) {
    whereClause = " WHERE " + whereConditions.join(" AND ");
  }

  countQuery += whereClause;
  dataQuery += whereClause + " ORDER BY created_at DESC LIMIT ? OFFSET ?";

  const dataParams = [...params, limit, offset];

  try {
    const countResult = await env.DB.prepare(countQuery).bind(...params).first<{ total: number }>();
    const total = countResult?.total || 0;

    const dataResult = await env.DB.prepare(dataQuery).bind(...dataParams).all();
    const data = dataResult.results || [];

    // Get all distinct source apps for the drop-down filter
    const appsResult = await env.DB.prepare("SELECT DISTINCT source_app FROM notifications ORDER BY source_app").all();
    const allApps = (appsResult.results || []).map((row: any) => row.source_app);

    return jsonResponse({
      ok: true,
      total,
      data,
      all_apps: allApps,
    });
  } catch (err: any) {
    return jsonResponse({ ok: false, error: err.message || "Failed to retrieve notifications" }, 500);
  }
}

async function handleApiAdminNotificationsForward(request: Request, env: Env): Promise<Response> {
  const username = await getActiveSession(request, env);
  if (!username) {
    return jsonResponse({ ok: false, error: "Unauthorized" }, 401);
  }

  let body: any;
  try {
    body = await request.json();
  } catch (e) {
    return jsonResponse({ ok: false, error: "Invalid request payload" }, 400);
  }

  const { id } = body;
  if (!id) {
    return jsonResponse({ ok: false, error: "ID notifikasi wajib diisi" }, 400);
  }

  try {
    const notif = await env.DB.prepare(
      "SELECT id, source_app, source_app_label, title, text, big_text, nominal_raw, nominal, notif_id, received_at, created_at FROM notifications WHERE id = ?"
    ).bind(id).first<any>();

    if (!notif) {
      return jsonResponse({ ok: false, error: "Notifikasi tidak ditemukan" }, 404);
    }

    await performForwarding(notif, env.DB);

    return jsonResponse({ ok: true });
  } catch (err: any) {
    return jsonResponse({ ok: false, error: err.message || "Failed to forward notification" }, 500);
  }
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    try {
      if (request.method === "OPTIONS") {
        return handleOptions();
      }

      const url = new URL(request.url);
      const path = url.pathname;

      // Public health check
      if (path === "/health") {
        if (request.method !== "GET") {
          return jsonResponse({ ok: false, error: "Method Not Allowed" }, 405);
        }
        return handleHealth();
      }

      // API: Receive notification from Flutter device
      if (path === "/notify") {
        if (request.method !== "POST") {
          return jsonResponse({ ok: false, error: "Method Not Allowed" }, 405);
        }
        return await handleNotify(request, env, ctx);
      }

      // API: List notifications (used by Flutter device settings test/dashboard)
      if (path === "/notifications") {
        if (request.method !== "GET") {
          return jsonResponse({ ok: false, error: "Method Not Allowed" }, 405);
        }
        return await handleList(request, env);
      }

      // Web: Login Page UI
      if (path === "/login") {
        if (request.method !== "GET") {
          return jsonResponse({ ok: false, error: "Method Not Allowed" }, 405);
        }
        return await handleWebLogin(request, env);
      }

      // Web: Dashboard Page UI
      if (path === "/dashboard") {
        if (request.method !== "GET") {
          return jsonResponse({ ok: false, error: "Method Not Allowed" }, 405);
        }
        return await handleWebDashboard(request, env);
      }

      // Web: Root Redirect
      if (path === "/") {
        return Response.redirect(new URL("/dashboard", request.url).toString(), 302);
      }

      // API Auth: Log In
      if (path === "/api/auth/login") {
        if (request.method !== "POST") {
          return jsonResponse({ ok: false, error: "Method Not Allowed" }, 405);
        }
        return await handleApiAuthLogin(request, env);
      }

      // API Auth: Log Out
      if (path === "/api/auth/logout") {
        if (request.method !== "POST") {
          return jsonResponse({ ok: false, error: "Method Not Allowed" }, 405);
        }
        return await handleApiAuthLogout(request, env);
      }

      // API Admin: Get settings
      if (path === "/api/admin/settings") {
        if (request.method !== "GET") {
          return jsonResponse({ ok: false, error: "Method Not Allowed" }, 405);
        }
        return await handleGetApiAdminSettings(request, env);
      }

      // API Admin: Update API Secret
      if (path === "/api/admin/settings/api-secret") {
        if (request.method !== "POST") {
          return jsonResponse({ ok: false, error: "Method Not Allowed" }, 405);
        }
        return await handlePostApiAdminSettingsApiSecret(request, env);
      }

      // API Admin: Update credentials
      if (path === "/api/admin/settings/credentials") {
        if (request.method !== "POST") {
          return jsonResponse({ ok: false, error: "Method Not Allowed" }, 405);
        }
        return await handlePostApiAdminSettingsCredentials(request, env);
      }

      // API Admin: Forwarding rules CRUD
      if (path === "/api/admin/forwarding") {
        if (request.method === "GET") {
          return await handleGetApiAdminForwarding(request, env);
        } else if (request.method === "POST") {
          return await handlePostApiAdminForwarding(request, env);
        }
        return jsonResponse({ ok: false, error: "Method Not Allowed" }, 405);
      }

      // API Admin: Toggle forwarding rule
      if (path === "/api/admin/forwarding/toggle") {
        if (request.method !== "POST") {
          return jsonResponse({ ok: false, error: "Method Not Allowed" }, 405);
        }
        return await handlePostApiAdminForwardingToggle(request, env);
      }

      // API Admin: Delete forwarding rule
      if (path === "/api/admin/forwarding/delete") {
        if (request.method !== "POST") {
          return jsonResponse({ ok: false, error: "Method Not Allowed" }, 405);
        }
        return await handlePostApiAdminForwardingDelete(request, env);
      }

      // API Admin: Test forwarding rule
      if (path === "/api/admin/forwarding/test") {
        if (request.method !== "POST") {
          return jsonResponse({ ok: false, error: "Method Not Allowed" }, 405);
        }
        return await handlePostApiAdminForwardingTest(request, env);
      }

      // API Admin: Statistics
      if (path === "/api/admin/stats") {
        if (request.method !== "GET") {
          return jsonResponse({ ok: false, error: "Method Not Allowed" }, 405);
        }
        return await handleApiAdminStats(request, env);
      }

      // API Admin: Notifications List
      if (path === "/api/admin/notifications") {
        if (request.method !== "GET") {
          return jsonResponse({ ok: false, error: "Method Not Allowed" }, 405);
        }
        return await handleApiAdminNotifications(request, env);
      }

      // API Admin: Manual Forward Notification
      if (path === "/api/admin/notifications/forward") {
        if (request.method !== "POST") {
          return jsonResponse({ ok: false, error: "Method Not Allowed" }, 405);
        }
        return await handleApiAdminNotificationsForward(request, env);
      }

      return jsonResponse({ ok: false, error: "Not Found" }, 404);
    } catch (error: any) {
      return jsonResponse({ ok: false, error: error.message || "Internal Server Error" }, 500);
    }
  },
};
