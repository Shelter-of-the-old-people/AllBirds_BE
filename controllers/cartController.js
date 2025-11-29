// controllers/cartController.js
const { Cart, Product } = require('../models');

// 1. 장바구니 조회 (GET)
exports.getCart = async (req, res) => {
  try {
    const userId = req.session.user._id; // 로그인한 유저 ID

    // populate: 상품 ID만 저장된 것에서 실제 상품 정보(이름, 가격, 이미지)를 가져옴
    let cart = await Cart.findOne({ userId }).populate('items.productId');

    if (!cart) {
      return res.json({ items: [] }); // 장바구니 없으면 빈 배열 반환
    }

    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "장바구니 조회 실패" });
  }
};

// 2. 장바구니 담기 (POST)
exports.addToCart = async (req, res) => {
  try {
    const userId = req.session.user._id;
    const { productId, size, quantity } = req.body;

    // [신규] 상품 정보 먼저 조회 (이미지 가져오기 위해)
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
    }

    // 대표 이미지 (첫 번째 이미지) 가져오기
    // 이미지가 아예 없는 경우 대비해 기본값 설정 추천
    const representativeImage = product.images && product.images.length > 0 
      ? product.images[0] 
      : '/uploads/default.png'; 

    // 1) 유저의 장바구니 찾기
    let cart = await Cart.findOne({ userId });

    // 2) 장바구니가 없으면 새로 생성
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // 3) 이미 같은 상품(같은 사이즈)이 있는지 확인
    const itemIndex = cart.items.findIndex(p => 
      p.productId.toString() === productId && p.size === Number(size)
    );

    if (itemIndex > -1) {
      // 있다면 수량 증가
      cart.items[itemIndex].quantity += Number(quantity);
      // (선택사항) 이미지 정보도 최신으로 업데이트
      cart.items[itemIndex].selectedImage = representativeImage; 
    } else {
      // 없다면 새로 추가
      cart.items.push({ 
        productId, 
        size: Number(size), 
        quantity: Number(quantity),
        selectedImage: representativeImage // [핵심] 여기에 이미지 저장!
      });
    }

    await cart.save();
    
    // 저장 후 갱신된 정보 반환
    const updatedCart = await Cart.findOne({ userId }).populate('items.productId');
    res.json(updatedCart);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "장바구니 담기 실패" });
  }
};

// 3. 장바구니 아이템 삭제 (DELETE)
exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.session.user._id;
    const { itemId } = req.params; // 삭제할 아이템의 고유 ID (_id)

    const cart = await Cart.findOne({ userId });
    
    // 해당 아이템만 필터링해서 제외시킴
    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    
    await cart.save();
    
    // 삭제 후 갱신된 정보 반환
    const updatedCart = await Cart.findOne({ userId }).populate('items.productId');
    res.json(updatedCart);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "삭제 실패" });
  }
};

// 4. 장바구니 수량 변경 (PUT)
exports.updateCartItem = async (req, res) => {
  try {
    const userId = req.session.user._id;
    const { itemId } = req.params; // 변경할 아이템의 _id (주소에서 가져옴)
    const { quantity } = req.body; // 변경할 최종 수량 (Body에서 가져옴)

    if (quantity < 1) {
      return res.status(400).json({ message: "수량은 1개 이상이어야 합니다." });
    }

    const cart = await Cart.findOne({ userId });
    
    // 아이템 찾기
    const item = cart.items.id(itemId); // Mongoose의 하위 문서 찾기 기능
    
    if (!item) {
      return res.status(404).json({ message: "해당 아이템을 찾을 수 없습니다." });
    }

    // 수량 덮어쓰기 (+= 가 아니라 = 입니다)
    item.quantity = Number(quantity);
    
    await cart.save();
    
    // 갱신된 정보 반환
    const updatedCart = await Cart.findOne({ userId }).populate('items.productId');
    res.json(updatedCart);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "수량 변경 실패" });
  }
};