const express = require('express');
const router = express.Router();
const kompetensiController = require('../controllers/kompetensiController');
const { auth, checkRole } = require('../middleware/auth');

router.get('/', auth, checkRole([1, 2, 3]), kompetensiController.getAllKompetensi);
router.get('/:id', auth, checkRole([1, 2]), kompetensiController.getKompetensiById);
router.post('/', auth, checkRole([1, 2]), kompetensiController.createKompetensi);
router.put('/:id', auth, checkRole([1, 2]), kompetensiController.updateKompetensi);
router.delete('/:id', auth, checkRole([1, 2]), kompetensiController.deleteKompetensi);

module.exports = router;
