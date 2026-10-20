const { send, method, originOk, env, supabase, requireAdmin } = require("../lib/server");
function clean(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("Enter contact details.");
  const phone = String(input.phone || "").trim().slice(0, 40);
  const email = String(input.email || "").trim().toLowerCase().slice(0, 254);
  if (phone && !/^[+0-9() .-]{7,40}$/.test(phone)) throw new Error("Enter a valid phone number with digits and optional +, spaces, brackets or hyphens.");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Enter a valid enquiry email address.");
  if (!phone && !email) throw new Error("Add at least a phone number or an enquiry email.");
  return { phone, email };
}
module.exports = async function handler(req, res) {
  if (!method(req, res, ["GET", "PUT"])) return;
  if (!originOk(req, res) || !env(res)) return;
  try {
    if (req.method === "GET") {
      const rows = await supabase("/rest/v1/site_settings?id=eq.public&select=data&limit=1");
      const data = rows && rows[0] && rows[0].data || {};
      res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=120");
      return send(res, 200, { phone: String(data.phone || ""), email: String(data.email || ""), instagramUrl: "https://www.instagram.com/srenterprises.india/" });
    }
    if (!(await requireAdmin(req, res))) return;
    const raw = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const data = clean(raw);
    await supabase("/rest/v1/site_settings?on_conflict=id", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify({ id: "public", data, updated_at: new Date().toISOString() })
    });
    return send(res, 200, { ok: true, phone: data.phone, email: data.email, instagramUrl: "https://www.instagram.com/srenterprises.india/" });
  } catch (error) {
    if (error.message && !error.status) return send(res, 400, { error: error.message });
    return send(res, 503, { error: "Contact settings could not be saved. Run supabase/contact-settings.sql in the Supabase SQL Editor and try again." });
  }
};