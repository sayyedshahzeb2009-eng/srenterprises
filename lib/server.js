const ALLOWED_ORIGIN = process.env.SITE_ORIGIN || "";

function send(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.end(JSON.stringify(payload));
}
function method(req, res, allowed) {
  if (!allowed.includes(req.method)) {
    res.setHeader("Allow", allowed.join(", "));
    send(res, 405, { error: "Method not allowed." });
    return false;
  }
  return true;
}
function originOk(req, res) {
  const origin = String(req.headers.origin || "");
  const mutating = ["POST", "PUT", "PATCH", "DELETE"].includes(String(req.method || "").toUpperCase());
  // Browser-origin check is defence-in-depth against cross-site request forgery.
  // All current browser form/admin mutations are same-origin fetch requests.
  if (mutating && !origin) {
    send(res, 403, { error: "A valid same-origin request is required." });
    return false;
  }
  if (!origin) return true; // Read-only requests and trusted server-to-server calls.
  if (ALLOWED_ORIGIN) {
    if (origin !== ALLOWED_ORIGIN) {
      send(res, 403, { error: "Request origin not allowed." });
      return false;
    }
    return true;
  }
  try {
    const parsed = new URL(origin);
    const host = String(req.headers.host || "").toLowerCase();
    if (!host || parsed.host.toLowerCase() !== host || !["https:", "http:"].includes(parsed.protocol)) {
      send(res, 403, { error: "Request origin not allowed." });
      return false;
    }
    return true;
  } catch {
    send(res, 403, { error: "Request origin not allowed." });
    return false;
  }
}
function env(res) {
  const missing = ["SUPABASE_URL", "SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY"].filter(k => !process.env[k]);
  if (missing.length) {
    send(res, 503, { error: "The secure product service is not configured yet." });
    return false;
  }
  return true;
}
async function supabase(path, options = {}) {
  const base = process.env.SUPABASE_URL.replace(/\/$/, "");
  const response = await fetch(base + path, {
    ...options,
    headers: {
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: "Bearer " + process.env.SUPABASE_SERVICE_ROLE_KEY,
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
  const text = await response.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = null; }
  if (!response.ok) {
    const error = new Error("Database request failed");
    error.status = response.status;
    throw error;
  }
  return data;
}
async function requireAdmin(req, res) {
  const auth = String(req.headers.authorization || "");
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token || token.length > 5000) {
    send(res, 401, { error: "Please sign in to the admin dashboard." });
    return false;
  }
  try {
    const response = await fetch(process.env.SUPABASE_URL.replace(/\/$/, "") + "/auth/v1/user", {
      headers: { apikey: process.env.SUPABASE_ANON_KEY, Authorization: "Bearer " + token }
    });
    if (!response.ok) {
      send(res, 401, { error: "Your session expired. Please sign in again." });
      return false;
    }
    const user = await response.json();
    const allowed = String(process.env.ADMIN_EMAIL || "").trim().toLowerCase();
    const verifiedEmail = String(user.email || "").trim().toLowerCase();
    if (!allowed || !verifiedEmail || verifiedEmail !== allowed || !user.email_confirmed_at) {
      send(res, 403, { error: "This account is not authorized to manage products." });
      return false;
    }
    return true;
  } catch {
    send(res, 503, { error: "Unable to verify the admin session right now." });
    return false;
  }
}
function cleanProduct(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("Enter valid product details.");
  const fields = ["id","name","category","tag","subtitle","price","hero","image2","image3","short","description","materials","dimensions","finish","comfort","care","lead"];
  const out = {};
  for (const key of fields) {
    const value = String(input[key] ?? "").trim();
    if (value.length > (["description","materials","care","lead"].includes(key) ? 3000 : 500)) throw new Error("One of the product fields is too long.");
    out[key] = value;
  }
  out.id = out.id.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(out.id)) throw new Error("Product ID must use lowercase letters, numbers and hyphens.");
  if (!out.name || !out.category || !out.hero || !out.short || !out.description) throw new Error("Product name, category, main image, short description and full description are required.");
  for (const key of ["hero","image2","image3"]) {
    if (out[key]) {
      let u;
      try { u = new URL(out[key]); } catch { throw new Error("Use a valid HTTPS image URL."); }
      if (u.protocol !== "https:") throw new Error("Product images must use HTTPS.");
    }
  }
  if (!Array.isArray(input.features) || input.features.length > 20) throw new Error("Add up to 20 product features.");
  out.features = input.features.map(v => String(v).trim().slice(0, 180)).filter(Boolean);
  return out;
}
module.exports = { send, method, originOk, env, supabase, requireAdmin, cleanProduct };