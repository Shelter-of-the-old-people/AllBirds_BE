// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { isAuthenticated } = require('../middlewares/auth');

// 로그인한 사람만 장바구니를 쓸 수 있으므로 미들웨어 체크가 필요하지만,
// 일단 기능 구현부터 하고 나중에 붙이겠습니다.

router.get('/', isAuthenticated, cartController.getCart);           // 조회
router.post('/', isAuthenticated, cartController.addToCart);        // 담기
router.delete('/:itemId', isAuthenticated, cartController.removeFromCart); // 삭제
router.put('/:itemId', isAuthenticated, cartController.updateCartItem);// 수량 변경

module.exports = router;