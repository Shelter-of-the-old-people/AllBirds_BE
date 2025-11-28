// controllers/productController.js
const { Product } = require('../models');

// 1. 상품 목록 조회 (필터링 포함)
exports.getAllProducts = async (req, res) => {
  try {
    // 쿼리 스트링으로 필터 조건을 받습니다.
    // 예: /api/products?categories=lifestyle,slip-on&materials=wool&sizes=250,260
    const { categories, materials, sizes, isNew, onSale } = req.query;

    let filter = {};

    // 1) 카테고리 필터 (OR 조건: lifestyle 이거나 slip-on 이거나)
    if (categories) {
      filter.categories = { $in: categories.split(',') };
    }

    // 2) 소재 필터 (OR 조건)
    if (materials) {
      filter.materials = { $in: materials.split(',') };
    }

    // 3) 사이즈 필터 (OR 조건: 250 또는 260 사이즈가 있는 신발)
    if (sizes) {
      // availableSizes 배열 안에 요청한 사이즈 중 하나라도 있으면 통과
      filter.availableSizes = { $in: sizes.split(',').map(Number) };
    }

    // 4) 신상품 필터 (최근 1달 이내)
    if (isNew === 'true') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      filter.createdAt = { $gte: oneMonthAgo };
    }

    // 5) 세일 상품 필터 (할인율이 0보다 큰 경우)
    if (onSale === 'true') {
      filter.discountRate = { $gt: 0 };
    }

    // DB에서 조회
    const products = await Product.find(filter).sort({ createdAt: -1 }); // 최신순 기본 정렬

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "상품 목록 조회 실패" });
  }
};

// 2. 상품 상세 조회 (ID로 찾기)
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "상품 상세 조회 실패" });
  }
};

// [신규] 상품 등록 (관리자용) - 이미지 포함
exports.createProduct = async (req, res) => {
  try {
    // 1. 텍스트 데이터 받기 (req.body)
    const { name, price, discountRate, categories, materials, availableSizes, description, detail, sustainability } = req.body;
    
    // 2. 이미지 파일 처리 (req.files)
    // multer를 통과하면 req.files에 파일 정보가 담깁니다.
    // 여기서 파일 경로만 뽑아서 DB에 저장할 배열로 만듭니다.
    let imagePaths = [];
    if (req.files && req.files.length > 0) {
      imagePaths = req.files.map(file => `/uploads/${file.filename}`);
    }

    // 사진 필수 요구사항 체크 
    if (imagePaths.length === 0) {
      return res.status(400).json({ message: "최소 1장 이상의 사진이 필요합니다." });
    }

    // 3. DB 저장용 객체 생성
    const newProduct = new Product({
      name,
      price: Number(price), // 숫자로 변환
      discountRate: Number(discountRate) || 0,
      // 콤마(,)로 구분된 문자열로 올 경우 배열로 변환 처리
      categories: Array.isArray(categories) ? categories : categories.split(','), 
      materials: Array.isArray(materials) ? materials : materials.split(','),
      availableSizes: Array.isArray(availableSizes) ? availableSizes : availableSizes.split(',').map(Number),
      images: imagePaths, // 이미지 경로 배열 저장
      description,
      detail,
      sustainability
    });

    await newProduct.save();

    res.status(201).json({ message: "상품 등록 성공", product: newProduct });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "상품 등록 실패", error: error.message });
  }
};
//  실시간 인기 상품 조회 (고정된 5개)
exports.getPopularProducts = async (req, res) => {
  try {
    const popularProducts = await Product.find()
      //.sort({ soldCount: -1 }) // 판매량 내림차순 (또는 고정하고 싶으면 _id로 정렬)
      .sort({ _id: -1 }) // _id: -1 (최신순/내림차순), _id: 1 (과거순/오름차순)
      .limit(10);               // 딱 10개만

    res.json(popularProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "인기 상품 조회 실패" });
  }
};