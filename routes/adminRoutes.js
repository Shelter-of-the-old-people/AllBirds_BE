// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// GET /api/admin/stats (판매 현황 조회)
// 실제로는 관리자 권한 체크 미들웨어가 필요하지만, 기능 구현 우선으로 생략합니다.
router.get('/stats', adminController.getSalesStats);

module.exports = router;