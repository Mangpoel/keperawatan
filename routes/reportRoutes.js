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

module.exports = router;
