const db = require('../db');

// CREATE Logbook Detail
exports.createLogbookDetail = async (req, res) => {
  try {
    const { logbook_id, kompetensi_id, inisial_pasien, tanggal, jumlah, spv } = req.body;

    if (!logbook_id || !kompetensi_id || !inisial_pasien || !tanggal || !jumlah || !spv) {
      return res.status(400).json({ message: "Data wajib diisi" });
    }

    // 🔍 Ambil data logbook untuk validasi
    const [logbookRows] = await db.query(
      "SELECT bulan, tahun, kode_pegawai FROM logbook WHERE logbook_id = ? AND status = 1",
      [logbook_id]
    );

    if (logbookRows.length === 0) {
      return res.status(404).json({ message: "Logbook tidak ditemukan" });
    }

    const logbook = logbookRows[0];

    // 🔒 Validasi kepemilikan logbook
    if (logbook.kode_pegawai !== req.user.kode_pegawai) {
      return res.status(403).json({
        message: "Anda tidak memiliki izin untuk menambahkan data ke logbook ini",
      });
    }

    // 🔍 Validasi bulan & tahun tanggal kegiatan
    const tanggalInput = new Date(tanggal);
    const bulanInput = tanggalInput.getMonth() + 1; // getMonth() hasilnya 0–11
    const tahunInput = tanggalInput.getFullYear();

    if (bulanInput !== Number(logbook.bulan) || tahunInput !== Number(logbook.tahun)) {
      return res.status(400).json({
        message: "Tanggal kegiatan tidak sesuai dengan bulan logbook.",
      });
    }

    // 🔢 Ambil bobot dari tabel kompetensi
    const [kompetensiRows] = await db.query(
      "SELECT bobot FROM kompetensi WHERE id = ?",
      [kompetensi_id]
    );

    if (kompetensiRows.length === 0) {
      return res.status(404).json({ message: "Kompetensi tidak ditemukan" });
    }

    const bobot = kompetensiRows[0].bobot;
    const nilai_skp = jumlah * bobot;

    // 💾 Simpan data logbook detail
    const [result] = await db.query(
      `INSERT INTO logbook_detail 
        (logbook_id, kompetensi_id, inisial_pasien, tanggal, jumlah, spv, nilai_skp, status_logbook, status, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 0, 1, NOW(), NOW())`,
      [logbook_id, kompetensi_id, inisial_pasien, tanggal, jumlah, spv, nilai_skp]
    );

    res.status(201).json({
      message: "Logbook detail berhasil ditambahkan",
      id: result.insertId,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// READ Semua Detail by Logbook ID
exports.getLogbookDetailByLogbook = async (req, res) => {
  try {
    const { logbook_id } = req.params;

    const [rows] = await db.query(
      `SELECT 
          d.*, 
          k.kategori, 
          k.uraian,
          p.nama_pegawai AS nama_spv
       FROM logbook_detail d
       LEFT JOIN kompetensi k ON d.kompetensi_id = k.id
       LEFT JOIN pegawai p ON d.spv = p.kode_pegawai
       WHERE d.logbook_id = ? AND d.status = 1 
       ORDER BY d.tanggal DESC`,
      [logbook_id]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// UPDATE Logbook Detail
exports.updateLogbookDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const { kompetensi_id, inisial_pasien, tanggal, jumlah, spv } = req.body;

    if (!kompetensi_id || !inisial_pasien || !tanggal || !jumlah || !spv) {
      return res.status(400).json({ message: "Data wajib diisi" });
    }

    // 🔍 Ambil data logbook detail untuk validasi awal
    const [detailRows] = await db.query(
      "SELECT logbook_id FROM logbook_detail WHERE id = ? AND status = 1",
      [id]
    );

    if (detailRows.length === 0) {
      return res.status(404).json({ message: "Logbook detail tidak ditemukan" });
    }

    const logbook_id = detailRows[0].logbook_id;

    // 🔍 Ambil data logbook induk
    const [logbookRows] = await db.query(
      "SELECT bulan, tahun, kode_pegawai FROM logbook WHERE logbook_id = ? AND status = 1",
      [logbook_id]
    );

    if (logbookRows.length === 0) {
      return res.status(404).json({ message: "Logbook tidak ditemukan" });
    }

    const logbook = logbookRows[0];

    // 🔒 Validasi kepemilikan logbook
    if (logbook.kode_pegawai !== req.user.kode_pegawai) {
      return res.status(403).json({
        message: "Anda tidak memiliki izin untuk memperbarui data logbook ini",
      });
    }

    // 🔍 Validasi bulan & tahun tanggal kegiatan
    const tanggalInput = new Date(tanggal);
    const bulanInput = tanggalInput.getMonth() + 1;
    const tahunInput = tanggalInput.getFullYear();

    if (bulanInput !== Number(logbook.bulan) || tahunInput !== Number(logbook.tahun)) {
      return res.status(400).json({
        message: "Tanggal kegiatan tidak sesuai dengan bulan logbook.",
      });
    }

    // 🔢 Ambil bobot dari tabel kompetensi
    const [kompetensiRows] = await db.query(
      "SELECT bobot FROM kompetensi WHERE id = ?",
      [kompetensi_id]
    );

    if (kompetensiRows.length === 0) {
      return res.status(404).json({ message: "Kompetensi tidak ditemukan" });
    }

    const bobot = kompetensiRows[0].bobot;
    const nilai_skp = jumlah * bobot;

    // 💾 Update data logbook detail
    const [result] = await db.query(
      `UPDATE logbook_detail 
       SET kompetensi_id = ?, inisial_pasien = ?, tanggal = ?, jumlah = ?, spv = ?, nilai_skp = ?, updated_at = NOW() 
       WHERE id = ? AND status = 1`,
      [kompetensi_id, inisial_pasien, tanggal, jumlah, spv, nilai_skp, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Logbook detail tidak ditemukan atau sudah dihapus" });
    }

    res.json({ message: "Logbook detail berhasil diperbarui" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// APPROVE / REJECT Logbook Detail
exports.verifyLogbookDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const { status_logbook } = req.body; // 1 = approve, 2 = reject

    if (![0, 1, 2].includes(status_logbook)) {
      return res.status(400).json({ message: "Status logbook tidak valid" });
    }

    const [result] = await db.query(
      `UPDATE logbook_detail 
       SET status_logbook = ?, updated_at = NOW()
       WHERE id = ? AND status = 1`,
      [status_logbook, id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: "Logbook detail tidak ditemukan" });

    res.json({ message: "Status logbook berhasil diperbarui" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// SOFT DELETE Logbook Detail
exports.deleteLogbookDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      "UPDATE logbook_detail SET status = 0, updated_at = NOW() WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: "Logbook detail tidak ditemukan" });

    res.json({ message: "Logbook detail berhasil dihapus (soft delete)" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
