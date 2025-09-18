const db = require("../db");

exports.getDashboardStats = async (req, res) => {
  try {
    const [
      [unitCount],
      [pegawaiCount],
      [kompetensiCount],
      [logbookCount],
      [logbookdetailCount]
    ] = await Promise.all([
      db.query("SELECT COUNT(*) AS total FROM unit WHERE status=1"),
      db.query("SELECT COUNT(*) AS total FROM pegawai WHERE status=1"),
      db.query("SELECT COUNT(*) AS total FROM kompetensi WHERE status=1"),
      db.query("SELECT COUNT(*) AS total FROM logbook WHERE status=1"),
      db.query("SELECT COUNT(*) AS total FROM logbook_detail WHERE status=1"),
    ]);

    res.json({
      unit: unitCount[0].total,
      pegawai: pegawaiCount[0].total,
      kompetensi: kompetensiCount[0].total,
      logbook: logbookCount[0].total,
      logbook_detail: logbookdetailCount[0].total,
    });
  } catch (err) {
    console.error("Error getDashboardStats:", err.message);
    res.status(500).json({ message: "Error mengambil data dashboard", error: err.message });
  }
};
