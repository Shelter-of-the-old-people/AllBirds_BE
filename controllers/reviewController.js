const { Review, Order } = require('../models');

exports.createReview = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }

    const userId = req.session.user._id;
    const { productId, rating, content, title } = req.body;

    const hasPurchased = await Order.findOne({
      userId: userId,
      'items.productId': productId, 
      status: 'paid' 
    });

    if (!hasPurchased) {
      return res.status(403).json({ message: "구매한 상품에 대해서만 후기를 작성할 수 있습니다." });
    }

    const existingReview = await Review.findOne({ userId, productId });
    if (existingReview) {
      return res.status(400).json({ message: "이미 후기를 작성하셨습니다." });
    }

    const newReview = new Review({
      userId,
      productId,
      rating: Number(rating),
      title,
      content
    });

    await newReview.save();

    res.status(201).json({ message: "소중한 후기 감사합니다!", review: newReview });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "후기 등록 실패" });
  }
};

exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ productId })
      .sort({ createdAt: -1 })
      .limit(3)                
      .populate('userId', 'name'); 

    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "후기 조회 실패" });
  }
};

exports.getMyReviews = async (req, res) => {
  try {
    const userId = req.session.user._id;
    const reviews = await Review.find({ userId });
    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "내 후기 조회 실패" });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const userId = req.session.user._id;
    const { reviewId } = req.params;
    const { rating, content, title } = req.body;

    const review = await Review.findOneAndUpdate(
      { _id: reviewId, userId }, 
      { rating: Number(rating), content, title },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ message: "후기를 찾을 수 없거나 권한이 없습니다." });
    }

    res.json({ message: "후기가 수정되었습니다.", review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "후기 수정 실패" });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const userId = req.session.user._id;
    const { reviewId } = req.params;

    const result = await Review.findOneAndDelete({ _id: reviewId, userId });

    if (!result) {
      return res.status(404).json({ message: "후기를 찾을 수 없거나 권한이 없습니다." });
    }

    res.json({ message: "후기가 삭제되었습니다." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "후기 삭제 실패" });
  }
};