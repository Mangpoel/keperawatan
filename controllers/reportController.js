const db = require('../db');

// Laporan Logbook + Detail
exports.getLogbookReport = async (req, res) => {
  try {
    const { tahun, bulan, kode_pegawai } = req.query;

    let sql = `
      SELECT 
          l.logbook_id,
          l.tahun,
          l.bulan,
          p.kode_pegawai,
          p.nama_pegawai,
          u.nama_unit,
          d.id AS detail_id,
          k.kategori,
          k.uraian,
          d.jumlah,
          k.bobot,
          d.nilai_skp,
          d.status_logbook,
          d.created_at AS detail_created
      FROM logbook l
      JOIN pegawai p ON l.kode_pegawai = p.kode_pegawai
      LEFT JOIN unit u ON p.unit_id = u.unit_id
      JOIN logbook_detail d ON l.logbook_id = d.logbook_id
      LEFT JOIN kompetensi k ON d.kompetensi_id = k.id
      WHERE l.status = 1 AND d.status = 1 AND d.status_logbook = 1
    `;

    const params = [];

    // filter opsional
    if (tahun) {
      sql += " AND l.tahun = ?";
      params.push(tahun);
    }
    if (bulan) {
      sql += " AND l.bulan = ?";
      params.push(bulan);
    }
    if (kode_pegawai) {
      sql += " AND p.kode_pegawai = ?";
      params.push(kode_pegawai);
    }

    sql += " ORDER BY l.tahun DESC, l.bulan DESC, l.logbook_id, d.created_at";

    const [rows] = await db.query(sql, params);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



//report rekap logbook
exports.getLogbookRekap = async (req, res) => {
  try {
    const { kode_pegawai, bulan, tahun } = req.query;

    let query = `
      SELECT 
        l.logbook_id,
        l.kode_pegawai,
        p.nama_pegawai,
        l.tahun,
        l.bulan,
        k.id AS kompetensi_id,
        k.kategori,
        k.uraian,
        k.bobot,
        k.target_tahun,
        SUM(d.jumlah) AS total_jumlah,
        SUM(d.nilai_skp) AS total_nilai_skp,
        COUNT(d.id) AS total_detail
      FROM logbook l
      JOIN pegawai p ON l.kode_pegawai = p.kode_pegawai
      JOIN logbook_detail d ON l.logbook_id = d.logbook_id
      JOIN kompetensi k ON d.kompetensi_id = k.id
      WHERE l.status = 1 AND d.status = 1 AND d.status_logbook = 1
    `;

    const params = [];

    if (kode_pegawai) {
      query += " AND l.kode_pegawai = ?";
      params.push(kode_pegawai);
    }
    if (bulan) {
      query += " AND l.bulan = ?";
      params.push(bulan);
    }
    if (tahun) {
      query += " AND l.tahun = ?";
      params.push(tahun);
    }

    query += `
      GROUP BY 
        l.logbook_id, l.kode_pegawai, p.nama_pegawai, l.tahun, l.bulan,
        k.id, k.kategori, k.uraian, k.bobot, k.target_tahun
      ORDER BY l.tahun DESC, l.bulan DESC, l.logbook_id ASC
    `;

    const [rows] = await db.query(query, params);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Rekap per bulan atau per tahun
exports.getLogbookRekapByMonth = async (req, res) => {
  try {
    const { bulan, tahun } = req.query;

    if (!tahun) {
      return res.status(400).json({ message: "Tahun wajib diisi" });
    }

    let query = `
      SELECT 
        l.logbook_id,
        l.kode_pegawai,
        p.nama_pegawai,
        l.tahun,
        l.bulan,
        k.id AS kompetensi_id,
        k.kategori,
        k.uraian,
        k.bobot,
        k.target_tahun,
        SUM(d.jumlah) AS total_jumlah,
        SUM(d.nilai_skp) AS total_nilai_skp,
        COUNT(d.id) AS total_detail
      FROM logbook l
      JOIN pegawai p ON l.kode_pegawai = p.kode_pegawai
      JOIN logbook_detail d ON l.logbook_id = d.logbook_id
      JOIN kompetensi k ON d.kompetensi_id = k.id
      WHERE l.status = 1 
        AND d.status = 1
        AND d.status_logbook = 1
        AND l.tahun = ?
    `;

    const params = [tahun];

    // kalau bulan ada, tambahkan ke query
    if (bulan) {
      query += ` AND l.bulan = ?`;
      params.push(bulan);
    }

    query += `
      GROUP BY 
        l.logbook_id, l.kode_pegawai, p.nama_pegawai, l.tahun, l.bulan,
        k.id, k.kategori, k.uraian, k.bobot, k.target_tahun
      ORDER BY l.kode_pegawai ASC, k.id ASC
    `;

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Detail per bulan atau per tahun
exports.getLogbookDetailByMonth = async (req, res) => {
  try {
    const { bulan, tahun } = req.query;

    if (!tahun) {
      return res.status(400).json({ message: "Tahun wajib diisi" });
    }

    let query = `
      SELECT 
        l.logbook_id,
        l.kode_pegawai,
        p.nama_pegawai,
        l.tahun,
        l.bulan,
        d.id AS logbook_detail_id,
        k.id AS kompetensi_id,
        k.kategori,
        k.uraian,
        k.bobot,
        k.target_tahun,
        d.jumlah,
        d.nilai_skp,
        d.status_logbook,
        d.created_at,
        d.updated_at
      FROM logbook l
      JOIN pegawai p ON l.kode_pegawai = p.kode_pegawai
      JOIN logbook_detail d ON l.logbook_id = d.logbook_id
      JOIN kompetensi k ON d.kompetensi_id = k.id
      WHERE l.status = 1 
        AND d.status = 1 
        AND d.status_logbook = 1
        AND l.tahun = ?
    `;

    const params = [tahun];

    // kalau bulan ada → tambahkan filter
    if (bulan) {
      query += ` AND l.bulan = ?`;
      params.push(bulan);
    }

    query += `
      ORDER BY l.kode_pegawai ASC, d.id ASC
    `;

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};