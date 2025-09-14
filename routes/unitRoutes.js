const express = require('express');
const router = express.Router();
const unitController = require('../controllers/unitController');
const { auth, checkRole } = require('../middleware/auth');

// CRUD unit
router.post('/', auth, checkRole([1]), unitController.createUnit);
router.get('/', auth, checkRole([1,2,3]), unitController.getAllUnit);
router.get('/:unitId', auth, checkRole([1,2,3]), unitController.getUnitById);
router.put('/:unitId', auth, checkRole([1,2,3]), unitController.updateUnit);
router.delete('/:unitId', auth, checkRole([1]), unitController.deleteUnit);

module.exports = router;
