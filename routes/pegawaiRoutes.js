const express = require('express');
const router = express.Router();
const pegawaiController = require('../controllers/pegawaiController');
const { auth, checkRole } = require('../middleware/auth');

// CRUD pegawai
router.post('/', auth, checkRole([1]), pegawaiController.createPegawai);
router.get('/', auth, checkRole([1]), pegawaiController.getAllPegawai);
// router.get('/unit/:unitId', auth, checkRole([1]), pegawaiController.getPegawaiByUnit);
router.get('/:kodePegawai', auth, checkRole([1]), pegawaiController.getPegawaiByKode);
router.put('/:kodePegawai', auth, checkRole([1]), pegawaiController.updatePegawai);
router.delete('/:kodePegawai', auth, checkRole([1]), pegawaiController.deletePegawai);

module.exports = router;
