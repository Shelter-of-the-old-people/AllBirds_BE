const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { isAuthenticated } = require('../middlewares/auth');

router.post('/', isAuthenticated, reviewController.createReview);

router.get('/my', isAuthenticated, reviewController.getMyReviews);

router.put('/:reviewId', isAuthenticated, reviewController.updateReview);

router.delete('/:reviewId', isAuthenticated, reviewController.deleteReview);

router.get('/:productId', reviewController.getProductReviews);

module.exports = router;