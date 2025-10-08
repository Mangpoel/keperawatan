const db = require('../db');
//expor ke excel
const ExcelJS = require('exceljs');
const PDFDocument = require("pdfkit");

// Laporan Logbook + Detail
// exports.getLogbookReport = async (req, res) => {
//   try {
//     const { tahun, bulan, kode_pegawai } = req.query;

//     let sql = `
//       SELECT 
//           l.logbook_id,
//           l.tahun,
//           l.bulan,
//           p.kode_pegawai,
//           p.nama_pegawai,
//           u.nama_unit,
//           d.id AS detail_id,
//           k.kategori,
//           k.uraian,
//           d.jumlah,
//           k.bobot,
//           d.nilai_skp,
//           d.status_logbook,
//           d.created_at AS detail_created
//       FROM logbook l
//       JOIN pegawai p ON l.kode_pegawai = p.kode_pegawai
//       LEFT JOIN unit u ON p.unit_id = u.unit_id
//       JOIN logbook_detail d ON l.logbook_id = d.logbook_id
//       LEFT JOIN kompetensi k ON d.kompetensi_id = k.id
//       WHERE l.status = 1 AND d.status = 1 AND d.status_logbook = 1
//     `;

//     const params = [];

//     // filter opsional
//     if (tahun) {
//       sql += " AND l.tahun = ?";
//       params.push(tahun);
//     }
//     if (bulan) {
//       sql += " AND l.bulan = ?";
//       params.push(bulan);
//     }
//     if (kode_pegawai) {
//       sql += " AND p.kode_pegawai = ?";
//       params.push(kode_pegawai);
//     }

//     sql += " ORDER BY l.tahun DESC, l.bulan DESC, l.logbook_id, d.created_at";

//     const [rows] = await db.query(sql, params);

//     res.json(rows);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
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
          d.tanggal AS tanggal_kegiatan,
          d.jumlah,
          k.bobot,
          d.nilai_skp,
          d.status_logbook
      FROM logbook l
      JOIN pegawai p ON l.kode_pegawai = p.kode_pegawai
      LEFT JOIN unit u ON p.unit_id = u.unit_id
      JOIN logbook_detail d ON l.logbook_id = d.logbook_id
      LEFT JOIN kompetensi k ON d.kompetensi_id = k.id
      WHERE l.status = 1 
        AND d.status = 1 
        AND d.status_logbook = 1
    `;

    const params = [];

    // Filter opsional
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

    sql += " ORDER BY l.tahun DESC, l.bulan DESC, d.tanggal DESC";

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


//export detail ke excel
// exports.exportLogbookExcel = async (req, res) => {
//   try {
//     const { tahun, bulan, kode_pegawai } = req.query;

//     // ambil data pakai query yg sama dengan getLogbookReport
//     let sql = `
//       SELECT 
//           l.tahun,
//           l.bulan,
//           p.kode_pegawai,
//           p.nama_pegawai,
//           u.nama_unit,
//           k.kategori,
//           k.uraian,
//           d.jumlah,
//           k.bobot,
//           d.nilai_skp
//       FROM logbook l
//       JOIN pegawai p ON l.kode_pegawai = p.kode_pegawai
//       LEFT JOIN unit u ON p.unit_id = u.unit_id
//       JOIN logbook_detail d ON l.logbook_id = d.logbook_id
//       LEFT JOIN kompetensi k ON d.kompetensi_id = k.id
//       WHERE l.status = 1 AND d.status = 1 AND d.status_logbook = 1
//     `;

//     const params = [];

//     if (tahun) { sql += " AND l.tahun = ?"; params.push(tahun); }
//     if (bulan) { sql += " AND l.bulan = ?"; params.push(bulan); }
//     if (kode_pegawai) { sql += " AND p.kode_pegawai = ?"; params.push(kode_pegawai); }

//     const [rows] = await db.query(sql, params);

//     // buat workbook & worksheet
//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet("Logbook Report");

//     // header
//     worksheet.columns = [
//       { header: "Tahun", key: "tahun", width: 10 },
//       { header: "Bulan", key: "bulan", width: 10 },
//       { header: "Kode Pegawai", key: "kode_pegawai", width: 15 },
//       { header: "Nama Pegawai", key: "nama_pegawai", width: 20 },
//       { header: "Unit", key: "nama_unit", width: 20 },
//       { header: "Kategori", key: "kategori", width: 15 },
//       { header: "Uraian", key: "uraian", width: 30 },
//       { header: "Jumlah", key: "jumlah", width: 10 },
//       { header: "Bobot", key: "bobot", width: 10 },
//       { header: "Nilai SKP", key: "nilai_skp", width: 15 }
//     ];

//     // isi data
//     rows.forEach(row => {
//       worksheet.addRow(row);
//     });

//     // set response headers untuk download excel
//     res.setHeader(
//       "Content-Type",
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//     );
//     res.setHeader("Content-Disposition", "attachment; filename=logbook.xlsx");

//     await workbook.xlsx.write(res);
//     res.end();

//   } catch (err) {
//     res.status(500).json({ message: "Error exporting excel", error: err.message });
//   }
// };

exports.exportLogbookExcel = async (req, res) => {
  try {
    const { tahun, kode_pegawai } = req.query;

    // Query tanpa kolom bulan, dan tambahkan tanggal kegiatan
    let sql = `
      SELECT 
          l.tahun,
          p.kode_pegawai,
          p.nama_pegawai,
          u.nama_unit,
          k.kategori,
          k.uraian,
          d.tanggal AS tanggal_kegiatan,
          d.jumlah,
          k.bobot,
          d.nilai_skp
      FROM logbook l
      JOIN pegawai p ON l.kode_pegawai = p.kode_pegawai
      LEFT JOIN unit u ON p.unit_id = u.unit_id
      JOIN logbook_detail d ON l.logbook_id = d.logbook_id
      LEFT JOIN kompetensi k ON d.kompetensi_id = k.id
      WHERE l.status = 1 
        AND d.status = 1 
        AND d.status_logbook = 1
    `;

    const params = [];

    if (tahun) {
      sql += " AND l.tahun = ?";
      params.push(tahun);
    }
    if (kode_pegawai) {
      sql += " AND p.kode_pegawai = ?";
      params.push(kode_pegawai);
    }

    sql += " ORDER BY p.kode_pegawai, d.tanggal";

    const [rows] = await db.query(sql, params);

    // Hitung total nilai SKP tahunan per pegawai
    const totalPerPegawai = {};
    rows.forEach(r => {
      if (!totalPerPegawai[r.kode_pegawai]) totalPerPegawai[r.kode_pegawai] = 0;
      totalPerPegawai[r.kode_pegawai] += parseFloat(r.nilai_skp || 0);
    });

    // Buat workbook & worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Logbook Tahunan");

    // Header kolom
    worksheet.columns = [
      // { header: "Tahun", key: "tahun", width: 10 },
       { header: "Tanggal Kegiatan", key: "tanggal_kegiatan", width: 18 },
      { header: "Kode Pegawai", key: "kode_pegawai", width: 15 },
      { header: "Nama Pegawai", key: "nama_pegawai", width: 25 },
      { header: "Unit", key: "nama_unit", width: 20 },     
      { header: "Kategori", key: "kategori", width: 20 },
      { header: "Uraian", key: "uraian", width: 30 },
      { header: "Jumlah", key: "jumlah", width: 10 },
      { header: "Bobot", key: "bobot", width: 10 },
      { header: "Nilai SKP", key: "nilai_skp", width: 15 }
      // { header: "Total SKP Tahunan", key: "total_skp_tahunan", width: 20 }
    ];

    // Isi data per baris
    rows.forEach(row => {
      worksheet.addRow({
        ...row,
        total_skp_tahunan: totalPerPegawai[row.kode_pegawai]
      });
    });

    // Format angka
    worksheet.getColumn('jumlah').numFmt = '#,##0';
    worksheet.getColumn('bobot').numFmt = '#,##0.00';
    worksheet.getColumn('nilai_skp').numFmt = '#,##0.00';
    // worksheet.getColumn('total_skp_tahunan').numFmt = '#,##0.00';

    // Styling header
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).alignment = { horizontal: "center" };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD9EAD3' }
    };

    // Kirim file ke client
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=logbook_tahunan.xlsx");

    await workbook.xlsx.write(res);
    res.end();

  } catch (err) {
    console.error(err);
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
      { header: "Total Jumlah Pasien", key: "total_jumlah", width: 15 },
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

exports.exportLogbookRekapExcelTahun = async (req, res) => {
  try {
    const { tahun, kode_pegawai } = req.query;

    let query = `
      SELECT 
        l.tahun,
        p.kode_pegawai,
        p.nama_pegawai,
        u.nama_unit,
        k.kategori,
        k.uraian,
        k.bobot,
        k.target_tahun,
        COALESCE(SUM(d.jumlah), 0) AS total_jumlah,
        COALESCE(SUM(d.jumlah * k.bobot), 0) AS total_nilai_skp,
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
    if (kode_pegawai) { query += " AND p.kode_pegawai = ?"; params.push(kode_pegawai); }

    query += `
      GROUP BY 
        l.tahun, p.kode_pegawai, p.nama_pegawai, u.nama_unit,
        k.kategori, k.uraian, k.bobot, k.target_tahun
      ORDER BY p.kode_pegawai, k.kategori
    `;

    const [rows] = await db.query(query, params);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Rekap Nilai SKP");

    worksheet.columns = [
      { header: "Tahun", key: "tahun", width: 10 },
      { header: "Kode Pegawai", key: "kode_pegawai", width: 15 },
      { header: "Nama Pegawai", key: "nama_pegawai", width: 25 },
      { header: "Unit", key: "nama_unit", width: 20 },
      { header: "Kategori", key: "kategori", width: 15 },
      { header: "Uraian", key: "uraian", width: 35 },
      { header: "Bobot", key: "bobot", width: 10 },
      { header: "Target Tahun", key: "target_tahun", width: 15 },
      { header: "Total Jumlah Pasien", key: "total_jumlah", width: 15 },
      { header: "Total Nilai SKP", key: "total_nilai_skp", width: 20 },
      { header: "Keterangan", key: "keterangan", width: 15 },
    ];

    rows.forEach(r => {
      r.bobot = r.bobot ? parseFloat(r.bobot) : 0;
      r.total_jumlah = r.total_jumlah ? parseFloat(r.total_jumlah) : 0;
      r.total_nilai_skp = r.total_nilai_skp ? parseFloat(r.total_nilai_skp) : 0;
      worksheet.addRow(r);
    });

    // Style header
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).alignment = { horizontal: "center", vertical: "middle" };

    // Tambahkan border & rata tengah untuk semua sel
    worksheet.eachRow({ includeEmpty: false }, (row) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        cell.alignment = { vertical: "middle", wrapText: true };
      });
    });

    // Format angka
    worksheet.getColumn('bobot').numFmt = '#,##0.00';
    worksheet.getColumn('total_nilai_skp').numFmt = '#,##0.00';

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=rekap_nilai_skp.xlsx");

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

    const doc = new PDFDocument({ margin: 30, size: "A4", layout: "landscape" }); // landscape biar muat tabel lebar
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=logbook_rekap.pdf");

    doc.pipe(res);

    // Judul
    doc.fontSize(16).text("Laporan Rekap Logbook", { align: "center" });
    doc.moveDown(2);

    // Header tabel
    const tableTop = 100;
    const rowHeight = 20;
    const colWidths = [40, 50, 70, 100, 80, 80, 120, 50, 50, 50, 60]; 
    // kolom: No, Tahun, Bulan, Kode Pegawai, Nama, Unit, Uraian, Bobot, Target, Jumlah, Nilai SKP
    const headers = [
      "No", "Tahun", "Bulan", "Kode Pegawai", "Nama Pegawai", "Unit",
      "Uraian", "Bobot", "Target", "Jumlah", "Nilai SKP"
    ];

    let x = doc.page.margins.left;
    headers.forEach((h, i) => {
      doc.font("Helvetica-Bold").fontSize(10).text(h, x, tableTop, { width: colWidths[i], align: "center" });
      x += colWidths[i];
    });

    // garis bawah header
    doc.moveTo(doc.page.margins.left, tableTop + rowHeight - 5)
       .lineTo(doc.page.width - doc.page.margins.right, tableTop + rowHeight - 5)
       .stroke();

    // isi data
    let y = tableTop + rowHeight;
    rows.forEach((row, index) => {
      let x = doc.page.margins.left;
      const data = [
        index + 1,
        row.tahun,
        row.bulan,
        row.kode_pegawai,
        row.nama_pegawai,
        row.nama_unit,
        row.uraian,
        row.bobot,
        row.target_tahun,
        row.total_jumlah,
        row.total_nilai_skp
      ];

      data.forEach((d, i) => {
        doc.font("Helvetica").fontSize(9).text(String(d || ""), x, y, {
          width: colWidths[i],
          align: "center"
        });
        x += colWidths[i];
      });

      y += rowHeight;

      // auto new page kalau melebihi
      if (y > doc.page.height - 50) {
        doc.addPage({ layout: "landscape" });
        y = tableTop;
      }
    });

    doc.end();

  } catch (err) {
    res.status(500).json({ message: "Error exporting rekap PDF", error: err.message });
  }
};





