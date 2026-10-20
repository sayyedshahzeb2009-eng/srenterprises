const crypto = require("crypto");
const { send, method, originOk, env, requireAdmin } = require("../lib/server");
const MAX_BYTES = 3 * 1024 * 1024;
const TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
module.exports = async function handler(req, res) {
  if (!method(req, res, ["POST"])) return;
  if (!originOk(req, res) || !env(res)) return;
  if (!(await requireAdmin(req, res))) return;
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const type = String(body.type || "");
    const name = String(body.name || "photo").slice(0, 120);
    const base64 = String(body.base64 || "");
    if (!TYPES.has(type)) return send(res, 415, { error: "Use a JPG, PNG, WebP or AVIF image." });
    if (!base64 || base64.length > Math.ceil(MAX_BYTES * 4 / 3) + 100) return send(res, 413, { error: "Image must be 3 MB or smaller." });
    const bytes = Buffer.from(base64, "base64");
    if (!bytes.length || bytes.length > MAX_BYTES) return send(res, 413, { error: "Image must be 3 MB or smaller." });
    const validBytes = type === "image/jpeg" ? bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff : type === "image/png" ? bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])) : type === "image/webp" ? bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP" : bytes.toString("ascii", 4, 12).includes("ftypavif") || bytes.toString("ascii", 4, 12).includes("ftypavis");
    if (!validBytes) return send(res, 415, { error: "The file contents do not match the selected image type." });
    const ext = ({ "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif" })[type];
    const safeName = name.normalize("NFKD").replace(/[^a-zA-Z0-9-_]/g, "-").replace(/-+/g, "-").slice(0, 40) || "product-photo";
    const path = safeName + "-" + crypto.randomUUID() + "." + ext;
    const base = process.env.SUPABASE_URL.replace(/\/$/, "");
    const response = await fetch(base + "/storage/v1/object/product-images/" + path, {
      method: "POST",
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: "Bearer " + process.env.SUPABASE_SERVICE_ROLE_KEY,
        "Content-Type": type,
        "x-upsert": "false"
      },
      body: bytes
    });
    if (!response.ok) return send(res, 502, { error: "Image upload failed. Check that the product-images bucket exists." });
    return send(res, 201, { url: base + "/storage/v1/object/public/product-images/" + path });
  } catch {
    return send(res, 400, { error: "Could not process that image. Please choose a valid image under 4 MB." });
  }
};