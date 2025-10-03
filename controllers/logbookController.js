const db = require('../db');

// CREATE Logbook
// exports.createLogbook = async (req, res) => {
//   try {
//     const { kode_pegawai, bulan, tahun } = req.body;

//     if (!kode_pegawai || !bulan || !tahun) {
//       return res.status(400).json({ message: "Data wajib diisi" });
//     }

//     // Prefix tahun+bulan, contoh: 202509
//     const prefix = `${tahun}${bulan.toString().padStart(2, '0')}`;

//     // Cari logbook_id terakhir untuk prefix ini
//     const [rows] = await db.query(
//       `SELECT logbook_id 
//        FROM logbook 
//        WHERE logbook_id LIKE ? 
//        ORDER BY logbook_id DESC LIMIT 1`,
//       [`${prefix}%`]
//     );

//     let nomorUrut = 1;
//     if (rows.length > 0) {
//       const lastId = rows[0].logbook_id;
//       nomorUrut = parseInt(lastId.toString().slice(-4)) + 1;
//     }

//     // Bentuk logbook_id baru
//     const logbook_id = `${prefix}${nomorUrut.toString().padStart(4, '0')}`;

//     // Insert ke tabel
//     await db.query(
//       `INSERT INTO logbook 
//         (logbook_id, kode_pegawai, bulan, tahun, status, created_at, updated_at) 
//        VALUES (?, ?, ?, ?, 1, NOW(), NOW())`,
//       [logbook_id, kode_pegawai, bulan, tahun]
//     );

//     res.status(201).json({ message: "Logbook berhasil ditambahkan", logbook_id });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


// CREATE Logbook
exports.createLogbook = async (req, res) => {
  try {
    const { kode_pegawai, bulan, tahun } = req.body;

    if (!kode_pegawai || !bulan || !tahun) {
      return res.status(400).json({ message: "Data wajib diisi" });
    }

    // 🔎 Validasi: Cek apakah pegawai sudah punya logbook aktif di bulan & tahun ini
    const [existing] = await db.query(
      `SELECT logbook_id 
       FROM logbook 
       WHERE kode_pegawai = ? AND bulan = ? AND tahun = ? AND status = 1`,
      [kode_pegawai, bulan, tahun]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        message: `Anda sudah membuat logbook di bulan ${bulan} tahun ${tahun}`
      });
    }

    // Prefix tahun+bulan, contoh: 202509
    const prefix = `${tahun}${bulan.toString().padStart(2, "0")}`;

    // Cari logbook_id terakhir untuk prefix ini
    const [rows] = await db.query(
      `SELECT logbook_id 
       FROM logbook 
       WHERE logbook_id LIKE ? 
       ORDER BY logbook_id DESC LIMIT 1`,
      [`${prefix}%`]
    );

    let nomorUrut = 1;
    if (rows.length > 0) {
      const lastId = rows[0].logbook_id;
      nomorUrut = parseInt(lastId.toString().slice(-4)) + 1;
    }

    // Bentuk logbook_id baru
    const logbook_id = `${prefix}${nomorUrut.toString().padStart(4, "0")}`;

    // Insert ke tabel
    await db.query(
      `INSERT INTO logbook 
        (logbook_id, kode_pegawai, bulan, tahun, status, created_at, updated_at) 
       VALUES (?, ?, ?, ?, 1, NOW(), NOW())`,
      [logbook_id, kode_pegawai, bulan, tahun]
    );

    res
      .status(201)
      .json({ message: "Logbook berhasil ditambahkan", logbook_id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};





// READ Semua Logbook
exports.getAllLogbook = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT l.*, 
              p.nama_pegawai, 
              u.nama_unit,
              COALESCE(SUM(ld.jumlah), 0) AS total_jumlah
       FROM logbook l
       LEFT JOIN pegawai p ON l.kode_pegawai = p.kode_pegawai
       LEFT JOIN unit u ON p.unit_id = u.unit_id
       LEFT JOIN logbook_detail ld ON l.logbook_id = ld.logbook_id AND ld.status = 1
       WHERE l.status = 1
       GROUP BY l.logbook_id
       ORDER BY l.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// READ Logbook by ID
exports.getLogbookById = async (req, res) => {
  try {
    const { logbook_id } = req.params;

    const [rows] = await db.query(
      `SELECT l.*, p.nama_pegawai, u.nama_unit 
       FROM logbook l
       LEFT JOIN pegawai p ON l.kode_pegawai = p.kode_pegawai
       LEFT JOIN unit u ON p.unit_id = u.unit_id
       WHERE l.logbook_id = ? AND l.status = 1`,
      [logbook_id]
    );

    if (rows.length === 0) return res.status(404).json({ message: "Logbook tidak ditemukan" });

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE Logbook
exports.updateLogbook = async (req, res) => {
  try {
    const { logbook_id } = req.params;
    const { kode_pegawai, bulan, tahun } = req.body;

    const [result] = await db.query(
      `UPDATE logbook 
       SET kode_pegawai = ?, bulan = ?, tahun = ?, updated_at = NOW() 
       WHERE logbook_id = ? AND status = 1`,
      [kode_pegawai, bulan, tahun, logbook_id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: "Logbook tidak ditemukan" });

    res.json({ message: "Logbook berhasil diperbarui" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// SOFT DELETE Logbook
exports.deleteLogbook = async (req, res) => {
  try {
    const { logbook_id } = req.params;

    const [result] = await db.query(
      "UPDATE logbook SET status = 0, updated_at = NOW() WHERE logbook_id = ?",
      [logbook_id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: "Logbook tidak ditemukan" });

    res.json({ message: "Logbook berhasil dihapus (soft delete)" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
