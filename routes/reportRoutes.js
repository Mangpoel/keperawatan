const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const auth = require('../middleware/auth');

// Laporan Logbook
router.get('/detail', reportController.getLogbookReport);
router.get('/rekap', reportController.getLogbookRekap);

// Rekap laporan filter per bulan
router.get('/rekap/bulanan', reportController.getLogbookRekapByMonth);

// Detail laporan filter per bulan
router.get('/detail/bulanan', reportController.getLogbookDetailByMonth);

// Export Detail
router.get("/export/detail/excel", reportController.exportLogbookExcel);
router.get("/export/detail/pdf", reportController.exportLogbookPDF);

// Export Rekap
router.get("/export/rekap/excel", reportController.exportLogbookRekapExcel);
router.get("/export/rekap/pdf", reportController.exportLogbookRekapPDF);


module.exports = router;
