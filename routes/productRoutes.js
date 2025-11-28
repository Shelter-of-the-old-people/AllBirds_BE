// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../utils/upload'); // [추가] 업로드 설정 불러오기
const { isAdmin } = require('../middlewares/auth');

// GET /api/products (목록 조회 & 필터링)
router.get('/', productController.getAllProducts);

//  실시간 인기 조회 
router.get('/popular', productController.getPopularProducts);

// GET /api/products/:id (상세 조회)
router.get('/:id', productController.getProductById);

// PUT /api/products/:id (상품 수정)
router.put('/:id', isAdmin, productController.updateProduct);

// 상품 등록 (POST)
// upload.array('images', 5): 'images'라는 이름으로 최대 5장까지 받겠다는 뜻
router.post('/', isAdmin, upload.array('images', 5), productController.createProduct);
    
module.exports = router;