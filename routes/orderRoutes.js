// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { isAuthenticated } = require('../middlewares/auth');

// POST /api/orders (결제하기)
router.post('/', isAuthenticated, orderController.createOrder);

// GET /api/orders (내 주문 내역 보기)
router.get('/', isAuthenticated, orderController.getUserOrders);

module.exports = router;