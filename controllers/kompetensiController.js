const db = require('../db');

// CREATE Kompetensi
exports.createKompetensi = async (req, res) => {
  try {
    const {kategori, uraian, bobot, target_tahun} = req.body;

    if (!kategori || !uraian || !bobot || !target_tahun) {
      return res.status(400).json({ message: "Semua field wajib diisi" });
    }

    const [result] = await db.query(
      `INSERT INTO kompetensi 
        (kategori, uraian, bobot, target_tahun, status, created_at, updated_at) 
       VALUES (?, ?, ?, ?, 1, NOW(), NOW())`,
      [kategori, uraian, bobot, target_tahun]
    );

    res.status(201).json({ message: "Kompetensi berhasil ditambahkan", id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ Semua Kompetensi
exports.getAllKompetensi = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM kompetensi WHERE status = 1 ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ Kompetensi by ID
exports.getKompetensiById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query("SELECT * FROM kompetensi WHERE id = ? AND status = 1", [id]);

    if (rows.length === 0) return res.status(404).json({ message: "Kompetensi tidak ditemukan" });

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE Kompetensi
exports.updateKompetensi = async (req, res) => {
  try {
    const { id } = req.params;
    const { kategori, uraian, bobot, target_tahun } = req.body;

    const [result] = await db.query(
      `UPDATE kompetensi 
       SET kategori = ?, uraian = ?, bobot = ?, target_tahun = ?, updated_at = NOW() 
       WHERE id = ? AND status = 1`,
      [kategori, uraian, bobot, target_tahun, id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: "Kompetensi tidak ditemukan" });

    res.json({ message: "Kompetensi berhasil diperbarui" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// SOFT DELETE Kompetensi
exports.deleteKompetensi = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      "UPDATE kompetensi SET status = 0, updated_at = NOW() WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: "Kompetensi tidak ditemukan" });

    res.json({ message: "Kompetensi berhasil dihapus (soft delete)" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
