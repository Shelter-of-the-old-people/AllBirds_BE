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
    const { productId, size, quantity, selectedImage } = req.body;

    // 상품 유효성 체크
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
    }

    // [핵심] 비교를 위해 저장될 이미지를 미리 확정합니다.
    // 프론트에서 보낸 이미지가 있으면 그것을, 없으면 제품의 첫 번째 이미지를 사용
    const targetImage = selectedImage || (product.images && product.images[0]);

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // [수정] 이미 같은 상품인지 확인할 때 '이미지(selectedImage)'까지 비교합니다.
    const itemIndex = cart.items.findIndex(p => 
      p.productId.toString() === productId && 
      p.size === Number(size) &&
      p.selectedImage === targetImage // 이미지가 다르면 다른 상품으로 취급
    );

    if (itemIndex > -1) {
      // 모든 조건(ID, 사이즈, 이미지)이 같으면 수량만 증가
      cart.items[itemIndex].quantity += Number(quantity);
    } else {
      // 하나라도 다르면(예: 사이즈는 같은데 이미지가 다름) 새로 추가
      cart.items.push({ 
        productId, 
        size: Number(size), 
        quantity: Number(quantity),
        selectedImage: targetImage 
      });
    }

    await cart.save();
    
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
    const { itemId } = req.params; // 변경할 아이템의 _id
    const { quantity } = req.body; // 변경할 최종 수량

    if (quantity < 1) {
      return res.status(400).json({ message: "수량은 1개 이상이어야 합니다." });
    }

    const cart = await Cart.findOne({ userId });
    
    // 아이템 찾기
    const item = cart.items.id(itemId); // Mongoose의 하위 문서 찾기 기능
    
    if (!item) {
      return res.status(404).json({ message: "해당 아이템을 찾을 수 없습니다." });
    }

    // 수량 덮어쓰기
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