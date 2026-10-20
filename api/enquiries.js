const { send, method, originOk, env, supabase, requireAdmin } = require("../lib/server");

function cleanText(value, max) {
  return String(value ?? "").trim().replace(/\u0000/g, "").slice(0, max);
}
function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
module.exports = async function handler(req, res) {
  if (!method(req, res, ["POST", "GET", "PATCH"])) return;
  if (!originOk(req, res) || !env(res)) return;
  try {
    if (req.method === "POST") {
      const raw = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
      // Quiet honeypot for basic bot submissions.
      if (cleanText(raw.website, 200)) return send(res, 200, { ok: true });
      const name = cleanText(raw.name, 120);
      const email = cleanText(raw.email, 254).toLowerCase();
      const interest = cleanText(raw.interest, 120) || "General enquiry";
      const message = cleanText(raw.message, 2000);
      const source = cleanText(raw.source, 30) || "contact-form";
      const productId = cleanText(raw.productId, 80);
      const productName = cleanText(raw.productName, 160);
      if (!name || !email || !validEmail(email)) return send(res, 400, { error: "Please enter your name and a valid email address." });
      if (name.length < 2) return send(res, 400, { error: "Please enter your full name." });
      if (!["contact-form", "product"].includes(source)) return send(res, 400, { error: "Invalid enquiry source." });
      if (Buffer.byteLength(JSON.stringify(raw), "utf8") > 12000) return send(res, 413, { error: "Your enquiry is too long." });
      const rows = await supabase("/rest/v1/enquiries", {
        method: "POST",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify({ name, email, interest, message, source, product_id: productId || null, product_name: productName || null })
      });
      return send(res, 201, { ok: true, id: rows && rows[0] ? rows[0].id : null, message: "Your enquiry has been sent successfully. SR Enterprises will review it." });
    }
    if (!(await requireAdmin(req, res))) return;
    if (req.method === "GET") {
      const rows = await supabase("/rest/v1/enquiries?select=id,name,email,interest,message,source,product_id,product_name,status,created_at&order=created_at.desc&limit=300");
      return send(res, 200, { enquiries: Array.isArray(rows) ? rows : [] });
    }
    const raw = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const id = Number(raw.id);
    const status = cleanText(raw.status, 20);
    if (!Number.isSafeInteger(id) || id < 1 || !["new", "contacted", "closed"].includes(status)) return send(res, 400, { error: "Invalid enquiry update." });
    const rows = await supabase("/rest/v1/enquiries?id=eq." + id, {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({ status })
    });
    if (!rows || !rows.length) return send(res, 404, { error: "Enquiry not found." });
    return send(res, 200, { ok: true });
  } catch (error) {
    if (error.message && !error.status) return send(res, 400, { error: "Could not process this enquiry. Please check the details and try again." });
    return send(res, 503, { error: "The enquiry inbox is temporarily unavailable. Please try again shortly." });
  }
};
