// controllers/reviewController.js
const { Review, Order } = require('../models');

// 1. 후기 작성 (POST) - 구매 내역 확인 필수
exports.createReview = async (req, res) => {
  try {
    // 1) 로그인 체크
    if (!req.session.user) {
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }

    const userId = req.session.user._id;
    const { productId, rating, content } = req.body;

    // 2) 구매 내역 확인 [핵심 로직] 
    // Order 컬렉션에서 "내 아이디"로 된 주문 중, "해당 상품(productId)"이 포함된 주문이 있는지 찾습니다.
    const hasPurchased = await Order.findOne({
      userId: userId,
      'items.productId': productId, // 중첩된 배열 필드 검색
      status: 'paid' // 결제 완료된 건만
    });

    if (!hasPurchased) {
      return res.status(403).json({ message: "구매한 상품에 대해서만 후기를 작성할 수 있습니다." });
    }

    // 3) 이미 작성한 후기가 있는지 확인 (선택 사항이지만 추천)
    const existingReview = await Review.findOne({ userId, productId });
    if (existingReview) {
      return res.status(400).json({ message: "이미 후기를 작성하셨습니다." });
    }

    // 4) 후기 저장
    const newReview = new Review({
      userId,
      productId,
      rating: Number(rating),
      content
    });

    await newReview.save();

    res.status(201).json({ message: "소중한 후기 감사합니다!", review: newReview });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "후기 등록 실패" });
  }
};

// 2. 상품별 후기 조회 (GET) - 최대 3개까지만 
exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    // 해당 상품의 후기를 최신순으로 3개만 가져옵니다.
    // .populate('userId', 'name') : 작성자의 이름만 가져옵니다 (비밀번호 제외)
    const reviews = await Review.find({ productId })
      .sort({ createdAt: -1 }) // 최신순
      .limit(3)                // 3개 제한 
      .populate('userId', 'name'); 

    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "후기 조회 실패" });
  }
};