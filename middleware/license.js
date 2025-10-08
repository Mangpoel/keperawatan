// src/middleware/license.middleware.js

const LICENSE_SERVER_URL =
  process.env.LICENSE_SERVER_URL || "https://billing.ocnetworks.web.id/api/v1/licenses/health";
const API_KEY = process.env.API_KEY || "0D8B-DA4C-2115-7C41-EB05"; // lisensi key dari license server

module.exports = async function licenseMiddleware(req, res, next) {
  try {
    const response = await fetch(LICENSE_SERVER_URL, {
      method: "GET",
      headers: {
        "x-api-key": API_KEY,
      },
    });

    if (response.ok) {
      return next();
    }

    const data = await response.json();
    return res.status(response.status).json({ message: data.message });
  } catch (err) {
    return res
      .status(503)
      .json({ message: "Cannot connect to License Server" });
  }
};
