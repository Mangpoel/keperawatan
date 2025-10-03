const db = require('../db');
//expor ke excel
const ExcelJS = require('exceljs');
const PDFDocument = require("pdfkit");

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
        p.kode_pegawai,
        p.nama_pegawai,
        u.nama_unit,
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
      LEFT JOIN unit u ON p.unit_id = u.unit_id
      JOIN logbook_detail d ON l.logbook_id = d.logbook_id
      JOIN kompetensi k ON d.kompetensi_id = k.id
      WHERE l.status = 1 AND d.status = 1 AND d.status_logbook = 1
    `;

    const params = [];

    if (kode_pegawai) {
      query += " AND p.kode_pegawai = ?";
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
        l.logbook_id, p.kode_pegawai, p.nama_pegawai, u.nama_unit, l.tahun, l.bulan,
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
    const { tahun, bulan, kode_pegawai } = req.query;

    if (!tahun) {
      return res.status(400).json({ message: "Tahun wajib diisi" });
    }

    let query = `
      SELECT 
        l.logbook_id,
        p.kode_pegawai,
        p.nama_pegawai,
        u.nama_unit,
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
      LEFT JOIN unit u ON p.unit_id = u.unit_id
      JOIN logbook_detail d ON l.logbook_id = d.logbook_id
      JOIN kompetensi k ON d.kompetensi_id = k.id
      WHERE l.status = 1 
        AND d.status = 1
        AND d.status_logbook = 1
        AND l.tahun = ?
    `;

     const params = [];

    // filter opsional
    if (tahun) {
      query += " AND l.tahun = ?";
      params.push(tahun);
    }
    if (bulan) {
      query += " AND l.bulan = ?";
      params.push(bulan);
    }
    if (kode_pegawai) {
      query += " AND p.kode_pegawai = ?";
      params.push(kode_pegawai);
    }


    query += `
      GROUP BY 
        l.logbook_id, p.kode_pegawai, p.nama_pegawai, u.nama_unit, l.tahun, l.bulan,
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
    const { bulan, tahun, kode_pegawai } = req.query;

    if (!tahun) {
      return res.status(400).json({ message: "Tahun wajib diisi" });
    }

    let query = `
      SELECT 
        l.logbook_id,
        p.kode_pegawai,
        p.nama_pegawai,
        u.nama_unit,
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
      LEFT JOIN unit u ON p.unit_id = u.unit_id
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
      ORDER BY p.kode_pegawai ASC, d.id ASC
    `;

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



exports.exportLogbookExcel = async (req, res) => {
  try {
    const { tahun, bulan, kode_pegawai } = req.query;

    // ambil data pakai query yg sama dengan getLogbookReport
    let sql = `
      SELECT 
          l.tahun,
          l.bulan,
          p.kode_pegawai,
          p.nama_pegawai,
          u.nama_unit,
          k.kategori,
          k.uraian,
          d.jumlah,
          k.bobot,
          d.nilai_skp
      FROM logbook l
      JOIN pegawai p ON l.kode_pegawai = p.kode_pegawai
      LEFT JOIN unit u ON p.unit_id = u.unit_id
      JOIN logbook_detail d ON l.logbook_id = d.logbook_id
      LEFT JOIN kompetensi k ON d.kompetensi_id = k.id
      WHERE l.status = 1 AND d.status = 1 AND d.status_logbook = 1
    `;

    const params = [];

    if (tahun) { sql += " AND l.tahun = ?"; params.push(tahun); }
    if (bulan) { sql += " AND l.bulan = ?"; params.push(bulan); }
    if (kode_pegawai) { sql += " AND p.kode_pegawai = ?"; params.push(kode_pegawai); }

    const [rows] = await db.query(sql, params);

    // buat workbook & worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Logbook Report");

    // header
    worksheet.columns = [
      { header: "Tahun", key: "tahun", width: 10 },
      { header: "Bulan", key: "bulan", width: 10 },
      { header: "Kode Pegawai", key: "kode_pegawai", width: 15 },
      { header: "Nama Pegawai", key: "nama_pegawai", width: 20 },
      { header: "Unit", key: "nama_unit", width: 20 },
      { header: "Kategori", key: "kategori", width: 15 },
      { header: "Uraian", key: "uraian", width: 30 },
      { header: "Jumlah", key: "jumlah", width: 10 },
      { header: "Bobot", key: "bobot", width: 10 },
      { header: "Nilai SKP", key: "nilai_skp", width: 15 }
    ];

    // isi data
    rows.forEach(row => {
      worksheet.addRow(row);
    });

    // set response headers untuk download excel
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=logbook.xlsx");

    await workbook.xlsx.write(res);
    res.end();

  } catch (err) {
    res.status(500).json({ message: "Error exporting excel", error: err.message });
  }
};


//export ke PDF


exports.exportLogbookPDF = async (req, res) => {
  try {
    const { tahun, bulan, kode_pegawai } = req.query;

    let sql = `
      SELECT 
          l.tahun,
          l.bulan,
          p.kode_pegawai,
          p.nama_pegawai,
          u.nama_unit,
          k.kategori,
          k.uraian,
          d.jumlah,
          k.bobot,
          d.nilai_skp
      FROM logbook l
      JOIN pegawai p ON l.kode_pegawai = p.kode_pegawai
      LEFT JOIN unit u ON p.unit_id = u.unit_id
      JOIN logbook_detail d ON l.logbook_id = d.logbook_id
      LEFT JOIN kompetensi k ON d.kompetensi_id = k.id
      WHERE l.status = 1 AND d.status = 1 AND d.status_logbook = 1
    `;

    const params = [];
    if (tahun) { sql += " AND l.tahun = ?"; params.push(tahun); }
    if (bulan) { sql += " AND l.bulan = ?"; params.push(bulan); }
    if (kode_pegawai) { sql += " AND p.kode_pegawai = ?"; params.push(kode_pegawai); }

    const [rows] = await db.query(sql, params);

    // buat PDF
    const doc = new PDFDocument({ margin: 30, size: "A4" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=logbook.pdf");

    doc.pipe(res);

    doc.fontSize(16).text("Logbook Report", { align: "center" });
    doc.moveDown();

    rows.forEach((row, index) => {
      doc.fontSize(10).text(
        `${index + 1}. ${row.tahun}-${row.bulan} | ${row.kode_pegawai} - ${row.nama_pegawai} | Unit: ${row.nama_unit} | ${row.kategori} - ${row.uraian} | Jumlah: ${row.jumlah} | Bobot: ${row.bobot} | Nilai SKP: ${row.nilai_skp}`
      );
      doc.moveDown(0.5);
    });

    doc.end();

  } catch (err) {
    res.status(500).json({ message: "Error exporting PDF", error: err.message });
  }
};


// ============================
// EXPORT REKAP EXCEL
// ============================
exports.exportLogbookRekapExcel = async (req, res) => {
  try {
    const { tahun, bulan, kode_pegawai } = req.query;

    let query = `
      SELECT 
        l.tahun,
        l.bulan,
        p.kode_pegawai,
        p.nama_pegawai,
        u.nama_unit,
        k.kategori,
        k.uraian,
        k.bobot,
        k.target_tahun,
        COALESCE(SUM(d.jumlah), 0) AS total_jumlah,
        COALESCE(SUM(d.jumlah * k.bobot), 0) AS total_nilai_skp,
        -- keterangan menggunakan ekspresi SUM(d.jumlah * k.bobot)
        IF(COALESCE(SUM(d.jumlah * k.bobot), 0) < COALESCE(k.target_tahun, 0), 'Tidak Lulus', 'Lulus') AS keterangan
      FROM logbook l
      JOIN pegawai p ON l.kode_pegawai = p.kode_pegawai
      LEFT JOIN unit u ON p.unit_id = u.unit_id
      JOIN logbook_detail d ON l.logbook_id = d.logbook_id
      JOIN kompetensi k ON d.kompetensi_id = k.id
      WHERE l.status = 1 AND d.status = 1 AND d.status_logbook = 1
    `;

    const params = [];
    if (tahun) { query += " AND l.tahun = ?"; params.push(tahun); }
    if (bulan) { query += " AND l.bulan = ?"; params.push(bulan); }
    if (kode_pegawai) { query += " AND p.kode_pegawai = ?"; params.push(kode_pegawai); }

    query += `
      GROUP BY 
        l.tahun, l.bulan, p.kode_pegawai, p.nama_pegawai, u.nama_unit,
        k.kategori, k.uraian, k.bobot, k.target_tahun
      ORDER BY l.tahun DESC, l.bulan DESC, p.kode_pegawai
    `;

    const [rows] = await db.query(query, params);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Logbook Rekap");

    worksheet.columns = [
      { header: "Tahun", key: "tahun", width: 10 },
      { header: "Bulan", key: "bulan", width: 10 },
      { header: "Kode Pegawai", key: "kode_pegawai", width: 15 },
      { header: "Nama Pegawai", key: "nama_pegawai", width: 20 },
      { header: "Unit", key: "nama_unit", width: 20 },
      { header: "Kategori", key: "kategori", width: 15 },
      { header: "Uraian", key: "uraian", width: 30 },
      { header: "Bobot", key: "bobot", width: 10 },
      { header: "Target Tahun", key: "target_tahun", width: 15 },
      { header: "Total Jumlah", key: "total_jumlah", width: 15 },
      { header: "Total Nilai SKP", key: "total_nilai_skp", width: 20 },
      { header: "Keterangan", key: "keterangan", width: 20 }
    ];

    // pastikan tipe data numeric benar (Excel suka string)
    rows.forEach(r => {
      // convert ke angka bila perlu
      r.bobot = r.bobot !== null ? parseFloat(r.bobot) : 0;
      r.total_jumlah = r.total_jumlah !== null ? parseInt(r.total_jumlah, 10) : 0;
      r.total_nilai_skp = r.total_nilai_skp !== null ? parseFloat(r.total_nilai_skp) : 0;
      worksheet.addRow(r);
    });

    // optional: format kolom angka
    worksheet.getColumn('bobot').numFmt = '#,##0.00';
    worksheet.getColumn('total_nilai_skp').numFmt = '#,##0.00';

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=logbook_rekap.xlsx");

    await workbook.xlsx.write(res);
    res.end();

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error exporting rekap excel", error: err.message });
  }
};


// ============================
// EXPORT REKAP PDF
// ============================
exports.exportLogbookRekapPDF = async (req, res) => {
  try {
    const { tahun, bulan, kode_pegawai } = req.query;

    let query = `
      SELECT 
        l.tahun,
        l.bulan,
        p.kode_pegawai,
        p.nama_pegawai,
        u.nama_unit,
        k.kategori,
        k.uraian,
        k.bobot,
        k.target_tahun,
        SUM(d.jumlah) AS total_jumlah,
        SUM(d.nilai_skp) AS total_nilai_skp
      FROM logbook l
      JOIN pegawai p ON l.kode_pegawai = p.kode_pegawai
      LEFT JOIN unit u ON p.unit_id = u.unit_id
      JOIN logbook_detail d ON l.logbook_id = d.logbook_id
      JOIN kompetensi k ON d.kompetensi_id = k.id
      WHERE l.status = 1 AND d.status = 1 AND d.status_logbook = 1
    `;

    const params = [];
    if (tahun) { query += " AND l.tahun = ?"; params.push(tahun); }
    if (bulan) { query += " AND l.bulan = ?"; params.push(bulan); }
    if (kode_pegawai) { query += " AND p.kode_pegawai = ?"; params.push(kode_pegawai); }

    query += `
      GROUP BY 
        l.tahun, l.bulan, p.kode_pegawai, p.nama_pegawai, u.nama_unit,
        k.kategori, k.uraian, k.bobot, k.target_tahun
      ORDER BY l.tahun DESC, l.bulan DESC, p.kode_pegawai
    `;

    const [rows] = await db.query(query, params);

    const doc = new PDFDocument({ margin: 30, size: "A4" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=logbook_rekap.pdf");

    doc.pipe(res);

    doc.fontSize(16).text("Laporan Rekap Logbook", { align: "center" });
    doc.moveDown();

    rows.forEach((row, index) => {
      doc.fontSize(10).text(
        `${index + 1}. ${row.tahun}-${row.bulan} | ${row.kode_pegawai} - ${row.nama_pegawai} | ${row.nama_unit}
         ${row.kategori} - ${row.uraian} | Jumlah: ${row.total_jumlah} | Nilai SKP: ${row.total_nilai_skp} | Bobot: ${row.bobot}`
      );
      doc.moveDown(0.5);
    });

    doc.end();

  } catch (err) {
    res.status(500).json({ message: "Error exporting rekap PDF", error: err.message });
  }
};


