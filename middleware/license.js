// src/middleware/license.middleware.js

// Pakai global fetch (Node >=18) atau fallback ke node-fetch (Node 16/14)
const fetch = global.fetch || require('node-fetch');

const { LICENSE_SERVER_URL, API_KEY } = process.env;

module.exports = async function licenseMiddleware(req, res, next) {
  try {
    // Validasi ENV biar gak 503 cuma karena URL kosong
    if (!LICENSE_SERVER_URL || !API_KEY) {
      return res.status(500).json({
        message: "License config missing (LICENSE_SERVER_URL/API_KEY)",
      });
    }

    const response = await fetch(LICENSE_SERVER_URL, {
      method: "GET",
      headers: { "x-api-key": API_KEY },
    });

    console.log("License server response status:", response.status);

    // OK → lanjut
    if (response.ok) return next();

    // 401 → paksa pesan generik (hindari “token bla bla”)
    if (response.status === 401) {
      return res.status(401).json({ message: "Invalid License" });
    }

    // Status lain → coba ambil pesan dari server (JSON atau text)
    let message = "License verification failed.";
    try {
      const ct = response.headers?.get?.("content-type") || "";
      if (ct.includes("application/json")) {
        const data = await response.json();
        if (typeof data?.message === "string" && data.message.trim()) {
          message = data.message;
        }
      } else {
        const text = await response.text();
        if (text && text.trim()) message = text;
      }
    } catch (_) {}

    return res.status(response.status).json({ message });
  } catch (err) {
    console.error("License check error:", err?.message || err);
    return res.status(503).json({ message: "Cannot connect to License Server" });
  }
};
