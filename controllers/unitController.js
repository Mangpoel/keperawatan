const db = require('../db');

// CREATE
exports.createUnit = async (req, res) => {
  try {
    const { unit_id, nama_unit, divisi, kode_kaunit, nama_kaunit } = req.body;

    const [result] = await db.query(
      `INSERT INTO unit (unit_id, nama_unit, divisi, kode_kaunit, nama_kaunit, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, 1, NOW(), NOW())`,
      [unit_id, nama_unit, divisi, kode_kaunit, nama_kaunit]
    );

    res.status(201).json({ message: "Unit created", unitId: result.insertId });
  } catch (err) {
    res.status(500).json({ message: "Error creating unit", error: err.message });
  }
};

// READ ALL
// exports.getAllUnit = async (req, res) => {
//   try {
//     const [rows] = await db.query(`SELECT * FROM unit WHERE status = 1`);
//     res.json(rows);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching units", error: err.message });
//   }
// };

// READ Semua Unit + Total Pegawai
exports.getAllUnit = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT 
         u.*, 
         COUNT(p.kode_pegawai) AS total_pegawai
       FROM unit u
       LEFT JOIN pegawai p ON u.unit_id = p.unit_id AND p.status = 1
       WHERE u.status = 1
       GROUP BY u.unit_id
       ORDER BY u.nama_unit ASC`
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Error fetching units", error: err.message });
  }
};


// READ ONE
exports.getUnitById = async (req, res) => {
  try {
    const { unitId } = req.params;
    const [rows] = await db.query(`SELECT * FROM unit WHERE unit_id = ? AND status = 1`, [unitId]);

    if (rows.length === 0) return res.status(404).json({ message: "Unit not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Error fetching unit", error: err.message });
  }
};

// UPDATE
exports.updateUnit = async (req, res) => {
  try {
    const { unitId } = req.params;
    const { nama_unit, divisi, kode_kaunit, nama_kaunit } = req.body;

    const [result] = await db.query(
      `UPDATE unit SET nama_unit=?, divisi=?, kode_kaunit=?, nama_kaunit=?, updated_at=NOW() WHERE unit_id=? AND status=1`,
      [nama_unit, divisi, kode_kaunit, nama_kaunit, unitId]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: "Unit not found" });
    res.json({ message: "Unit updated" });
  } catch (err) {
    res.status(500).json({ message: "Error updating unit", error: err.message });
  }
};

// DELETE (soft delete → ubah status jadi 0)
exports.deleteUnit = async (req, res) => {
  try {
    const { unitId } = req.params;
    const [result] = await db.query(
      `UPDATE unit SET status=0, updated_at=NOW() WHERE unit_id=?`,
      [unitId]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: "Unit not found" });
    res.json({ message: "Unit deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting unit", error: err.message });
  }
};
