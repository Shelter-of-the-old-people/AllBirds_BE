// seed.js
const mongoose = require('mongoose');
const { User, Product } = require('./models');

// DB 연결
mongoose.connect('mongodb://127.0.0.1:27017/Allbirds_DB')
  .then(() => {
    console.log('DB 연결 성공, 데이터 주입을 시작합니다...');
    initData();
  })
  .catch(err => console.log('DB 연결 에러:', err));

const initData = async () => {
  try {
    // 1. 기존 데이터 초기화 (중복 방지)
    await User.deleteMany({});
    await Product.deleteMany({});

    // 2. 관리자 계정 생성 (Source: 200, 257)
    // 요구사항: 계정은 고객과 관리자로 구분됨, 관리자는 로그인 후 상품관리 가능
    const adminUser = new User({
      userId: 'admin',      // 관리자 아이디
      password: '1234',     // 관리자 비밀번호 (실무에선 암호화 필요하지만 텀프에선 평문 허용 범위)
      name: '관리자',
      isAdmin: true         // [핵심] 관리자 권한 부여
    });

    // 3. 일반 고객 계정 생성 (테스트용)
    const normalUser = new User({
      userId: 'customer1',
      password: '1234',
      name: '김철수',
      isAdmin: false
    });

    await adminUser.save();
    await normalUser.save();
    console.log('✅ 사용자(관리자/고객) 생성 완료');

    // 4. 초기 상품 데이터 생성 (Source: 137, 294)
    // 요구사항: 라이프 스타일과 슬립온 신발 각각 10개 이상, 이미지는 최소 2개 이상
    // 여기서는 예시로 2개만 넣습니다. 나중에 복사해서 늘리세요.
    const products = [
      {
        name: '남성 울 러너 미즐',
        price: 108000,
        discountRate: 40,
        categories: ['lifestyle'], // 라이프스타일
        materials: ['wool'],       // 울 소재
        availableSizes: [250, 260, 270, 280],
        images: ['/uploads/sample1_1.jpg', '/uploads/sample1_2.jpg'],
        description: '캐주얼, 비즈니스, 클래식 스니커즈'
      },
      {
        name: '남성 트리 러너',
        price: 150000,
        discountRate: 0,
        categories: ['slip-on', 'lifestyle'], // 슬립온이면서 라이프스타일
        materials: ['tree'],      // 트리 소재
        availableSizes: [260, 270, 280],
        images: ['/uploads/sample2_1.jpg', '/uploads/sample2_2.jpg'],
        description: '가볍고 통기성이 좋은 데일리 슈즈'
      }
    ];

    await Product.insertMany(products);
    console.log('✅ 상품 데이터 생성 완료');

    console.log('🎉 모든 초기 데이터 주입이 끝났습니다. 프로그램을 종료합니다.');
    process.exit();

  } catch (error) {
    console.error('데이터 주입 중 에러 발생:', error);
    process.exit(1);
  }
};