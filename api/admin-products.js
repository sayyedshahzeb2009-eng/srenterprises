const { send, method, originOk, env, supabase, requireAdmin, cleanProduct } = require("../lib/server");
module.exports = async function handler(req, res) {
  if (!method(req, res, ["GET", "POST", "PUT", "DELETE"])) return;
  if (!originOk(req, res) || !env(res)) return;
  if (!(await requireAdmin(req, res))) return;
  try {
    if (req.method === "GET") {
      const rows = await supabase("/rest/v1/products?select=id,data,active,created_at,updated_at&order=created_at.desc");
      return send(res, 200, { products: (rows || []).map(row => ({ ...row.data, id: row.id, active: row.active, updated_at: row.updated_at })) });
    }
    const raw = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    if (Buffer.byteLength(JSON.stringify(raw), "utf8") > 30000) return send(res, 413, { error: "Product details are too large." });
    if (req.method === "POST" || req.method === "PUT") {
      const product = cleanProduct(raw);
      if (req.method === "POST") {
        const row = await supabase("/rest/v1/products", { method: "POST", headers: { Prefer: "return=representation" }, body: JSON.stringify({ id: product.id, data: product, active: true }) });
        return send(res, 201, { product: row[0] ? { ...row[0].data, id: row[0].id } : product });
      }
      const row = await supabase("/rest/v1/products?id=eq." + encodeURIComponent(product.id), { method: "PATCH", headers: { Prefer: "return=representation" }, body: JSON.stringify({ data: product, updated_at: new Date().toISOString() }) });
      if (!row || !row.length) return send(res, 404, { error: "Product not found. Refresh the list and try again." });
      return send(res, 200, { product: { ...row[0].data, id: row[0].id } });
    }
    const id = String((raw && raw.id) || "").trim();
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) return send(res, 400, { error: "Invalid product ID." });
    await supabase("/rest/v1/products?id=eq." + encodeURIComponent(id), { method: "DELETE" });
    return send(res, 200, { ok: true });
  } catch (error) {
    if (error.message && !error.status) return send(res, 400, { error: error.message });
    return send(res, 500, { error: "Could not save product. Check the database setup and try again." });
  }
};