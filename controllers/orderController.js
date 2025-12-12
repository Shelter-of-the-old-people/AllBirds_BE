// controllers/orderController.js
const { Order, Cart, Product } = require('../models');

// 1. 주문 생성 (결제하기)
exports.createOrder = async (req, res) => {
  try {
    const userId = req.session.user._id;

    // 1) 유저의 장바구니 가져오기 (상품 정보 포함)
    const cart = await Cart.findOne({ userId }).populate('items.productId');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "장바구니가 비어있습니다." });
    }

    let totalAmount = 0;
    const orderItems = [];

    // 2) 장바구니 아이템을 주문 아이템 형태로 변환 & 금액 계산
    for (const item of cart.items) {
      const product = item.productId;
      
      // 상품이 삭제되었을 경우 대비
      if (!product) continue;

      // [중요] 결제 당시의 실제 가격 계산 (원가 * (1 - 할인율/100))
      // 예: 10,000원 10% 할인 -> 9,000원
      const discountedPrice = product.price * (1 - product.discountRate / 100);
      
      totalAmount += discountedPrice * item.quantity;

      const orderImage = item.selectedImage || (product.images && product.images[0]);

      orderItems.push({
        productId: product._id,
        name: product.name,       
        size: item.size,
        quantity: item.quantity,
        price: discountedPrice,
        image: orderImage   
      });

      // 3) 상품 판매량(soldCount) 증가 (판매순 정렬 위해 필요)
      await Product.findByIdAndUpdate(product._id, {
        $inc: { soldCount: item.quantity }
      });
    }

    // 4) 주문 생성 및 저장
    const newOrder = new Order({
      userId,
      items: orderItems,
      totalAmount: Math.round(totalAmount) // 소수점 제거
    });

    await newOrder.save();

    // 5) 장바구니 비우기 
    cart.items = [];
    await cart.save();

    res.status(201).json({ message: "주문이 완료되었습니다.", orderId: newOrder._id });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "주문 처리 중 오류 발생" });
  }
};

// 2. 내 주문 내역 조회 (마이페이지용) 
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.session.user._id;
    
    // 최신순 정렬 (내림차순)
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "주문 내역 조회 실패" });
  }
};