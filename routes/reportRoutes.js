const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
// const auth = require('../middleware/auth');
const { auth, checkRole } = require('../middleware/auth');

// Laporan Logbook
router.get('/detail',auth, checkRole([1, 2, 3]), reportController.getLogbookReport);
router.get('/rekap',auth, checkRole([1, 2, 3]), reportController.getLogbookRekap);

// Rekap laporan filter per bulan
router.get('/rekap/bulanan', auth, checkRole([1, 2, 3]), reportController.getLogbookRekapByMonth);

// Detail laporan filter per bulan
router.get('/detail/bulanan', auth, checkRole([1, 2, 3]), reportController.getLogbookDetailByMonth);
    
// Export Detail
router.get("/export/detail/excel", reportController.exportLogbookExcel);
router.get("/export/detail/pdf", auth, checkRole([1, 2, 3]), reportController.exportLogbookPDF);

// Export Rekap
router.get("/export/rekap/excel", reportController.exportLogbookRekapExcel);
router.get("/export/rekap/excel2", reportController.exportLogbookRekapExcelTahun);
router.get("/export/rekap/pdf",auth, checkRole([1, 2, 3]), reportController.exportLogbookRekapPDF);


module.exports = router;
