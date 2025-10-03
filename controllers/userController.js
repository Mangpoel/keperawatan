const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { username, password, kode_pegawai, role } = req.body;

    // Cek apakah username sudah ada
    const [checkUser] = await db.query(`SELECT * FROM user WHERE username = ?`, [username]);
    if (checkUser.length > 0) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user baru
    const [result] = await db.query(
      `INSERT INTO user (username, password, kode_pegawai, role, status, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      [username, hashedPassword, kode_pegawai, role, 1] // status 1 = aktif
    );

    res.status(201).json({ 
      message: "User registered successfully", 
      userId: result.insertId 
    });
  } catch (err) {
    res.status(500).json({ 
      message: "Error registering user", 
      error: err.message 
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Cari user aktif
    const [rows] = await db.query(
      `SELECT * FROM user WHERE username = ? AND status = 1`,
      [username]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: "User not found or inactive" });
    }

    const user = rows[0];

    // Cek password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Ambil data pegawai berdasarkan kode_pegawai user
    // const [pegawaiData] = await db.query(
    //   `SELECT p.kode_pegawai, p.nama_pegawai, p.unit_id, u.nama_unit
    //    FROM pegawai p
    //    LEFT JOIN unit u ON p.unit_id = u.unit_id
    //    WHERE p.kode_pegawai = ?`,
    //   [user.kode_pegawai]
    // );

  const [pegawaiData] = await db.query(
  `SELECT p.kode_pegawai, 
          p.nama_pegawai, 
          p.unit_id, 
          u.nama_unit, 
          u.kode_kaunit,
          u.nama_kaunit
   FROM pegawai p
   LEFT JOIN unit u ON p.unit_id = u.unit_id
   WHERE p.kode_pegawai = ?`,
  [user.kode_pegawai]
);


    const pegawai = pegawaiData.length > 0 ? pegawaiData[0] : null;

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role, kode_pegawai: user.kode_pegawai },
      process.env.JWT_SECRET || "secret_key",
      { expiresIn: "7d" }
    );

    res.json({
  message: "Login successful",
  token,
  user: {
    id: user.id,
    username: user.username,
    role: user.role,
    kode_pegawai: user.kode_pegawai,
    nama_pegawai: pegawai?.nama_pegawai || null,
    unit_id: pegawai?.unit_id || null,
    nama_unit: pegawai?.nama_unit || null,
    kode_kaunit: pegawai?.kode_kaunit || null, // ✅ tambah
    nama_kaunit: pegawai?.nama_kaunit || null  // ✅ tambah
  },
});
  } catch (err) {
    res.status(500).json({
      message: "Error logging in",
      error: err.message,
    });
  }
};

// ambil data user
exports.getAllUser = async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM user WHERE status = 1`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Error fetching units", error: err.message });
  }
};

// Fungsi Edit User (UPDATE)
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params; // Ambil ID dari parameter URL
    const { username, password, kode_pegawai, role } = req.body;

    // Cek apakah user ada
    const [checkUser] = await db.query(`SELECT * FROM user WHERE id = ?`, [id]);
    if (checkUser.length === 0) {
      return res.status(404).json({ message: "User not found" }); // Ganti status jadi 404
    }

    // Hash password jika ada password baru
    let hashedPassword = checkUser[0].password; // Default: password lama
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Update user
    const [result] = await db.query(
      `UPDATE user SET username = ?, password = ?, kode_pegawai = ?, role = ?, updated_at = NOW() WHERE id = ?`,
      [username, hashedPassword, kode_pegawai, role, id]
    );

    res.json({ message: "User updated successfully" });

  } catch (err) {
    res.status(500).json({ message: "Error updating user", error: err.message });
  }
};

// Fungsi Soft Delete (Ubah Status Jadi 0)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Cek apakah user ada
    const [checkUser] = await db.query(`SELECT * FROM user WHERE id = ?`, [id]);
     if (checkUser.length === 0) {
      return res.status(404).json({ message: "User not found" }); // Ganti status jadi 404
    }

    // Soft delete: ubah status jadi 0
    const [result] = await db.query(
      `UPDATE user SET status = 0, updated_at = NOW() WHERE id = ?`,
      [id]
    );

    res.json({ message: "User deleted successfully (soft delete)" });

  } catch (err) {
    res.status(500).json({ message: "Error deleting user", error: err.message });
  }
};


