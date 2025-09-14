const db = require('../db');

// CREATE Pegawai
exports.createPegawai = async (req, res) => {
  try {
    const { kode_pegawai, nama_pegawai, unit_id, divisi } = req.body;

    if (!kode_pegawai || !nama_pegawai) {
      return res.status(400).json({ message: "Kode pegawai dan nama pegawai wajib diisi" });
    }

    const [result] = await db.query(
      `INSERT INTO pegawai 
        (kode_pegawai, nama_pegawai, unit_id, divisi, status, created_at, updated_at) 
       VALUES (?, ?, ?, ?, 1, NOW(), NOW())`,
      [kode_pegawai, nama_pegawai, unit_id, divisi]
    );

    res.status(201).json({ message: "Pegawai berhasil ditambahkan", kode_pegawai });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ Semua Pegawai
exports.getAllPegawai = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT p.*, u.nama_unit 
       FROM pegawai p 
       LEFT JOIN unit u ON p.unit_id = u.unit_id 
       WHERE p.status = 1 ORDER BY p.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ Pegawai by Kode
exports.getPegawaiByKode = async (req, res) => {
  try {
    const { kode_pegawai } = req.params;
    const [rows] = await db.query(
      `SELECT p.*, u.nama_unit 
       FROM pegawai p 
       LEFT JOIN unit u ON p.unit_id = u.id 
       WHERE p.kode_pegawai = ? AND p.status = 1`,
      [kode_pegawai]
    );

    if (rows.length === 0) return res.status(404).json({ message: "Pegawai tidak ditemukan" });

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE Pegawai
exports.updatePegawai = async (req, res) => {
  try {
    const { kode_pegawai } = req.params;
    const { nama_pegawai, unit_id, divisi } = req.body;

    const [result] = await db.query(
      `UPDATE pegawai 
       SET nama_pegawai = ?, unit_id = ?, divisi = ?, updated_at = NOW() 
       WHERE kode_pegawai = ? AND status = 1`,
      [nama_pegawai, unit_id, divisi, kode_pegawai]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: "Pegawai tidak ditemukan" });

    res.json({ message: "Pegawai berhasil diperbarui" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// SOFT DELETE Pegawai
exports.deletePegawai = async (req, res) => {
  try {
    const { kode_pegawai } = req.params;

    const [result] = await db.query(
      "UPDATE pegawai SET status = 0, updated_at = NOW() WHERE kode_pegawai = ?",
      [kode_pegawai]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: "Pegawai tidak ditemukan" });

    res.json({ message: "Pegawai berhasil dihapus (soft delete)" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
