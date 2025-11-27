// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = 5000;

// 1. 미들웨어 설정
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 2. 세션 설정
app.use(session({
    secret: 'team-project-secret-key',
    resave: false,
    saveUninitialized: false
}));

// 3. DB 연결
mongoose.connect('mongodb://127.0.0.1:27017/Allbirds_DB')
    .then(() => console.log('✅ MongoDB 연결 성공!'))
    .catch(err => console.log('❌ MongoDB 연결 실패:', err));

// ==========================================
// 4. 라우터 연결 (여기가 바뀐 핵심 부분!)
// ==========================================
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes'); 
const cartRoutes = require('./routes/cartRoutes'); 
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const adminRoutes = require('./routes/adminRoutes');

// '/api/auth'로 시작하는 주소는 authRoutes 파일로 보낸다.
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes); 
app.use('/api/cart', cartRoutes); 
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

// 5. 서버 실행
app.listen(PORT, () => {
    console.log(` 서버 실행 중: http://localhost:${PORT}`);
});