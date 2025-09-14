const express = require('express');
const router = express.Router();
const logbookDetailController = require('../controllers/logbookDetailController');
const { auth, checkRole } = require('../middleware/auth');

router.post('/', auth, checkRole([1, 2]), logbookDetailController.createLogbookDetail);
router.get('/:logbook_id', auth, checkRole([1, 2]), logbookDetailController.getLogbookDetailByLogbook);
router.put('/:id', auth, checkRole([1, 2]), logbookDetailController.updateLogbookDetail);
router.patch('/verify/:id', auth, checkRole([1, 2]), logbookDetailController.verifyLogbookDetail);
router.delete('/:id', auth, checkRole([1, 2]), logbookDetailController.deleteLogbookDetail);

module.exports = router;