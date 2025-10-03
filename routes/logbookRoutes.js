const express = require('express');
const router = express.Router();
const logbookController = require('../controllers/logbookController');
const { auth, checkRole } = require('../middleware/auth');

router.post('/', auth, checkRole([1, 3]), logbookController.createLogbook);
router.get('/', auth, checkRole([1, 3]), logbookController.getAllLogbook);
router.get('/:logbook_id', auth, checkRole([1, 3]), logbookController.getLogbookById);
router.put('/:logbook_id', auth, checkRole([1, 3]), logbookController.updateLogbook);
router.delete('/:logbook_id', auth, checkRole([1, 3]), logbookController.deleteLogbook);

module.exports = router;
