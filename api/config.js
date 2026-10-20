const { send, method } = require("../lib/server");
module.exports = function handler(req, res) {
  if (!method(req, res, ["GET"])) return;
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    return send(res, 503, { error: "Admin service is not configured." });
  }
  res.setHeader("Cache-Control", "no-store");
  return send(res, 200, { supabaseUrl: process.env.SUPABASE_URL, supabaseAnonKey: process.env.SUPABASE_ANON_KEY });
};