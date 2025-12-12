const mongoose = require('mongoose');
const { Schema } = mongoose;

// 1. 사용자 (userId로 로그인)
const userSchema = new Schema({
  userId: { type: String, required: true, unique: true }, 
  password: { type: String, required: true },
  name: { type: String, required: true },
  isAdmin: { type: Boolean, default: false } 
}, { timestamps: true });

// 2. 상품 (색상 제거, 관리자용 필드 포함)
const productSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  discountRate: { type: Number, default: 0 },
  soldCount: { type: Number, default: 0 }, 
  categories: [{ type: String }], 
  materials: [{ type: String }],
  images: [{ type: String }], // 이미지 경로 배열
  availableSizes: [{ type: Number }], // [230, 240...]
  description: { type: String }, 
  detail: { type: String },
  sustainability: { type: String } 
}, { timestamps: true });

// 3. 장바구니
const cartSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [{
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    size: { type: Number, required: true },
    quantity: { type: Number, default: 1 },
    selectedImage: { type: String } 
  }]
}, { timestamps: true });

// 4. 주문 (매출 집계용)
const orderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    name: { type: String }, 
    size: { type: Number },
    quantity: { type: Number },
    price: { type: Number, required: true },
    image: { type: String }
  }],
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'paid' },
  orderedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// 5. 후기
const reviewSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  content: { type: String, required: true }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const Cart = mongoose.model('Cart', cartSchema);
const Order = mongoose.model('Order', orderSchema);
const Review = mongoose.model('Review', reviewSchema);

module.exports = { User, Product, Cart, Order, Review };