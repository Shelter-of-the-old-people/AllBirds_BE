// routes/reviewRoutes.js
const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// POST /api/reviews (후기 작성)
router.post('/', reviewController.createReview);

// GET /api/reviews/:productId (특정 상품의 후기 보기)
router.get('/:productId', reviewController.getProductReviews);

module.exports = router;