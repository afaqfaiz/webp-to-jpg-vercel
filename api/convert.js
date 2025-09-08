const axios = require("axios");
const sharp = require("sharp");
const { URL } = require("url");

// Simple allowlist (optional): set env ALLOWED_HOSTS as "example.com,cdn.example.net"
// If not set, no host blocking is applied.
const allowedHostsEnv = process.env.ALLOWED_HOSTS || "";
const ALLOWED_HOSTS = allowedHostsEnv
  .split(",")
  .map(h => h.trim())
  .filter(Boolean);

// Helper: check allowed host
function isHostAllowed(targetUrl) {
  if (ALLOWED_HOSTS.length === 0) return true; // no restriction
  try {
    const u = new URL(targetUrl);
    return ALLOWED_HOSTS.includes(u.hostname);
  } catch {
    return false;
  }
}

module.exports = async (req, res) => {
  try {
    // Accept GET only
    if (req.method !== "GET") {
      res.status(405).send("Only GET allowed");
      return;
    }

    const url = req.query.url || req.query.u;
    if (!url) {
      res.status(400).send("Missing required query param: url");
      return;
    }

    // Validate URL format
    let parsed;
    try {
      parsed = new URL(url);
      if (!/^https?:$/.test(parsed.protocol)) {
        res.status(400).send("Only http(s) URLs are allowed");
        return;
      }
    } catch (err) {
      res.status(400).send("Invalid URL");
      return;
    }

    // Check allowed hosts (optional)
    if (!isHostAllowed(url)) {
      res.status(403).send("Host not allowed");
      return;
    }

    // Fetch remote image (arraybuffer)
    const response = await axios.get(url, {
      responseType: "arraybuffer",
      timeout: 15000, // 15s timeout
      headers: {
        // identify as a basic browser-like request (some servers behave differently)
        "User-Agent": "Mozilla/5.0 (compatible; WebP-to-JPG-proxy/1.0)",
        // Accept all images
        Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8"
      },
      maxContentLength: 25 * 1024 * 1024 // 25 MB max
    });

    const inputBuffer = Buffer.from(response.data);

    // Convert to JPEG in memory using sharp
    // If input is already JPEG, sharp will re-encode to JPEG as well
    const jpgBuffer = await sharp(inputBuffer)
      .jpeg({ quality: 90 })
      .toBuffer();

    // Return JPEG - NO caching headers set (per your instruction)
    res.setHeader("Content-Type", "image/jpeg");
    res.setHeader("Content-Length", jpgBuffer.length);
    // intentionally not setting Cache-Control

    res.status(200).send(jpgBuffer);

  } catch (err) {
    console.error("Conversion error:", err && err.message ? err.message : err);
    // Distinguish common errors
    if (err.code === "ECONNABORTED") {
      res.status(504).send("Timeout fetching the target image");
    } else if (err.response && err.response.status) {
      // upstream returned error
      res.status(502).send(`Upstream fetch failed: ${err.response.status}`);
    } else {
      res.status(500).send("Failed to fetch/convert image");
    }
  }
};
