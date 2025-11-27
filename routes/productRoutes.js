// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../utils/upload'); // [추가] 업로드 설정 불러오기

// GET /api/products (목록 조회 & 필터링)
router.get('/', productController.getAllProducts);

// GET /api/products/:id (상세 조회)
router.get('/:id', productController.getProductById);

// [신규] 상품 등록 (POST)
// upload.array('images', 5): 'images'라는 이름으로 최대 5장까지 받겠다는 뜻
router.post('/', upload.array('images', 5), productController.createProduct);

module.exports = router;