const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const { auth, checkRole } = require('../middleware/auth');

// Endpoint GET /dashboard/stats
router.get("/stats", auth, checkRole([1,2,3]), dashboardController.getDashboardStats);

module.exports = router;
