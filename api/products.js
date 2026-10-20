const { send, method, env, supabase } = require("../lib/server");
module.exports = async function handler(req, res) {
  if (!method(req, res, ["GET"])) return;
  if (!env(res)) return;
  try {
    const rows = await supabase("/rest/v1/products?select=id,data,active&active=eq.true&order=created_at.desc");
    const products = (Array.isArray(rows) ? rows : []).map(row => ({ ...row.data, id: row.id }));
    res.setHeader("Cache-Control", "public, s-maxage=30, stale-while-revalidate=60");
    return send(res, 200, { products });
  } catch {
    return send(res, 503, { error: "Product catalogue is temporarily unavailable." });
  }
};