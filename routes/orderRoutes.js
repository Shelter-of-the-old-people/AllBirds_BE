// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// POST /api/orders (결제하기)
router.post('/', orderController.createOrder);

// GET /api/orders (내 주문 내역 보기)
router.get('/', orderController.getUserOrders);

module.exports = router;