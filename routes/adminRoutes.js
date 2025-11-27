// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAdmin } = require('../middlewares/auth');

// GET /api/admin/stats (판매 현황 조회)
router.get('/stats', isAdmin, adminController.getSalesStats);
module.exports = router;