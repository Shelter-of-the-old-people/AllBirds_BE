const mongoose = require('mongoose');
const { User, Product, Order } = require('./models');

mongoose.connect('mongodb://127.0.0.1:27017/Allbirds_DB')
  .then(() => {
    console.log('✅ DB 연결 성공, 데이터 주입을 시작합니다...');
    initData();
  })
  .catch(err => console.log('❌ DB 연결 에러:', err));

const initData = async () => {
  try {
    // 1. 초기화
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});

    // 2. 사용자 생성
    const users = await User.insertMany([
      { userId: 'admin', password: '1234', name: '관리자', isAdmin: true },
      { userId: 'customer1', password: '1234', name: '김철수', isAdmin: false },
      { userId: 'customer2', password: '1234', name: '이영희', isAdmin: false },
      { userId: 'customer3', password: '1234', name: '박지민', isAdmin: false } // 유저 추가
    ]);
    const u1 = users[1]._id; // 김철수
    const u2 = users[2]._id; // 이영희
    const u3 = users[3]._id; // 박지민

    console.log('✅ 사용자 계정 생성 완료');

    // 3. 상품 데이터 (36개)
    const productsData = [
      // ... (기존 36개 상품 데이터 유지) ...
      // --- Image 1 ---
      { name: '남성 울 러너 NZ', price: 150000, discountRate: 34, categories: ['lifestyle'], materials: ['부드럽고 따뜻한 wool'], availableSizes: [250, 260, 270], images: ['/uploads/shoe1_1.png', '/uploads/shoe1_2.png'], description: '아이코닉 실루엣의 진화—한층 편안한 착화감과 현대적인 미감.' },
      { name: '남성 트리 러너 NZ', price: 170000, discountRate: 30, categories: ['lifestyle'], materials: ['부드럽고 따뜻한 wool'], availableSizes: [250, 260, 270, 280], images: ['/uploads/shoe2_1.png', '/uploads/shoe2_2.png', '/uploads/shoe2_3.png', '/uploads/shoe2_4.png'], description: '최상의 편안함을 위해 세심하게 만들어진 트리 러너 NZ는 메모리폼 풋베드로 다양한 발 형태에도 유연하게 대응해, 누구에게나 안정적인 착화감을 제공합니다.' },
      { name: '남성 트리 대셔 2', price: 170000, discountRate: 54, categories: ['lifestyle'], materials: ['플라스틱 제로 식물성 가죽'], availableSizes: [260, 270, 280], images: ['/uploads/shoe3_1.png', '/uploads/shoe3_2.png'], description: '트리 대셔 2(Tree Dasher 2)는 데일리 러닝, 워킹, 가벼운 운동에 최적화된 올버즈의 차세대 베스트 러닝화입니다.' },
      { name: '남성 트리 스키퍼', price: 150000, discountRate: 48, categories: ['slip-on'], materials: ['캔버스'], availableSizes: [250, 260, 270], images: ['/uploads/shoe4_1.png', '/uploads/shoe4_2.png', '/uploads/shoe4_3.png'], description: '트리 스키퍼(Tree Skipper)는 편하게 신을 수 있는 보트화 스타일 스니커즈입니다.' },
      { name: '남성 트리 러너', price: 170000, discountRate: 30, categories: ['lifestyle'], materials: ['부드럽고 따뜻한 wool'], availableSizes: [250, 260, 270, 280], images: ['/uploads/shoe5_1.png', '/uploads/shoe5_2.png'], description: '하루 종일 신어도 편안한 올버즈 베스트셀러 트리 러너는, 사계절 내내 가볍게 즐길 수 있는 데일리 스니커즈입니다.' },
      { name: '남성 울 러너 고', price: 150000, discountRate: 34, categories: ['slip-on', 'lifestyle'], materials: ['가볍고 시원한 tree'], availableSizes: [250, 260, 270], images: ['/uploads/shoe6_1.png', '/uploads/shoe6_2.png'], description: '울 러너 고(Wool Runner GO)는 전작의 편안함을 살리면서 현대적인 디자인을 섞어 재탄생한 올버즈의 새로운 코어 실루엣입니다.' },

      // --- Image 2 ---
      { name: '남성 울 크루저 슬립온', price: 170000, discountRate: 30, categories: ['slip-on'], materials: ['부드럽고 따뜻한 wool'], availableSizes: [250, 260, 270, 280], images: ['/uploads/shoe7_1.png', '/uploads/shoe7_2.png'], description: '메리노 울과 리사이클 나일론을 블렌드한 어퍼로 유난히 편안하며, 이지한 스타일과 하루 종일 이어지는 착화감으로 어디에서든 손이 가는 선택.' },
      { name: '남성 크루저', price: 170000, discountRate: 30, categories: ['lifestyle'], materials: ['가볍고 시원한 tree'], availableSizes: [250, 260, 270], images: ['/uploads/shoe8_1.png', '/uploads/shoe8_2.png'], description: '크루저(Cruiser)는 클래식 로우탑 디자인을 재해석한 따뜻한 날씨에 적합한 데일리 캐주얼 스니커즈입니다.' },
      { name: '남성 울 러너', price: 180000, discountRate: 45, categories: ['slip-on'], materials: ['가볍고 시원한 tree'], availableSizes: [260, 270, 280], images: ['/uploads/shoe9_1.png', '/uploads/shoe9_2.png'], description: '오리지날 베스트 아이템 울 러너(Wool Runner)는 부드러운 메리노 울 신발의 시작이며, 16년 타임지에서 ‘세상에서 가장 편한 신발’로 선정되었습니다.' },
      { name: '남성 캔버스 파이퍼', price: 150000, discountRate: 48, categories: ['slip-on', 'lifestyle'], materials: ['가볍고 시원한 tree'], availableSizes: [250, 260, 270], images: ['/uploads/shoe10_1.png', '/uploads/shoe10_2.png'], description: '캔버스 파이퍼(Canvas Piper)는 친환경 캔버스 면으로 제작해 뛰어난 내구성과 편안한 착화감을 가진 올버즈의 새로운 스니커즈입니다.' },
      { name: '남성 트리 글라이더', price: 150000, discountRate: 48, categories: ['lifestyle'], materials: ['가볍고 시원한 tree'], availableSizes: [250, 260, 270, 280], images: ['/uploads/shoe11_1.png', '/uploads/shoe11_2.png'], description: '활동적인 라이프스타일을 위해 설계된 트리 글라이더(Tree Glider)는 다양한 상황에서 사용할 수 있는 스포티한 일상용 신발입니다.' },
      { name: '남성 트리 러너 고', price: 170000, discountRate: 42, categories: ['lifestyle', 'slip-on'], materials: ['부드럽고 따뜻한 wool'], availableSizes: [250, 260, 270], images: ['/uploads/shoe12_1.png', '/uploads/shoe12_2.png'], description: '트리 러너 고(Tree Runner GO)는 전작의 편안함을 살리면서 현대적인 디자인을 섞어 재탄생한 올버즈의 새로운 코어 실루엣입니다.' },

      // --- Image 3 ---
      { name: '남성 스트라이더 익스플로어', price: 170000, discountRate: 30, categories: ['slip-on', 'lifestyle'], materials: ['부드럽고 따뜻한 wool'], availableSizes: [250, 260, 270], images: ['/uploads/shoe13_1.png', '/uploads/shoe13_2.png'], description: '모험가를 위해 설계된 스트라이더 익스플로어(Strider Explore)는 어떤 곳에서든 흔들림 없는 편안함을 제공합니다.' },
      { name: '남성 러너 NZ 리믹스', price: 150000, discountRate: 48, categories: ['lifestyle'], materials: ['부드럽고 따뜻한 wool'], availableSizes: [250, 260, 270], images: ['/uploads/shoe14_1.png', '/uploads/shoe14_2.png'], description: '클래식한 감성과 시그니처 착화감은 그대로. 한층 더 업그레이드된 친환경 소재와 안정적인 착화감으로 완성한 러너 NZ 리믹스(Runner NZ Remix)를 만나보세요.' },
      { name: '남성 크루저 미드 익스플로어', price: 150000, discountRate: 34, categories: ['lifestyle'], materials: ['부드럽고 따뜻한 wool'], availableSizes: [230, 240, 250], images: ['/uploads/shoe15_1.png', '/uploads/shoe15_2.png'], description: '모험가를 위해 설계된 크루저 미드 익스플로어(Cruiser Mid Explore)는 어떤 곳에서든 흔들림 없는 편안함을 제공합니다.' },
      { name: '남성 크루저 리믹스', price: 180000, discountRate: 56, categories: ['lifestyle'], materials: ['가볍고 시원한 tree'], availableSizes: [260, 270, 280], images: ['/uploads/shoe16_1.png', '/uploads/shoe16_2.png'], description: '클래식한 감성과 시그니처 착화감은 그대로. 한층 더 업그레이드된 친환경 소재와 부드러운 편안함으로 완성한 크루저 리믹스(Cruiser Remix)를 만나보세요.' },
      { name: '남성 스트라이더', price: 180000, discountRate: 56, categories: ['lifestyle', 'slip-on'], materials: ['가볍고 시원한 tree'], availableSizes: [250, 260, 270], images: ['/uploads/shoe17_1.png', '/uploads/shoe17_2.png'], description: '일상은 물론, 운동까지 끊김 없는 편안함. 스트라이더(Strider)는 다양한 상황에서 사용할 수 있는 스포티한 일상용 신발입니다.' },
      { name: '남성 울 스트라이더', price: 150000, discountRate: 48, categories: ['slip-on', 'lifestyle'], materials: ['부드럽고 따뜻한 wool'], availableSizes: [250, 260, 270], images: ['/uploads/shoe18_1.png', '/uploads/shoe18_2.png'], description: '일상은 물론, 운동까지 끊김 없는 편안함. 울 스트라이더(Wool Strider)는 다양한 상황에서 사용할 수 있는 스포티한 일상용 신발입니다.' },

      // --- Image 4 ---
      { name: '남성 울 파이퍼', price: 170000, discountRate: 30, categories: ['slip-on', 'lifestyle'], materials: ['부드럽고 따뜻한 wool'], availableSizes: [250, 260, 270], images: ['/uploads/shoe19_1.png', '/uploads/shoe19_2.png', '/uploads/shoe19_3.png'], description: 'Wool Piper는 클래식 로우탑 디자인을 재해석한 데일리 캐주얼슈즈입니다.' },
      { name: '남성 크루저 코듀로이', price: 150000, discountRate: 30, categories: ['lifestyle'], materials: ['부드럽고 따뜻한 wool'], availableSizes: [250, 260, 270], images: ['/uploads/shoe20_1.png', '/uploads/shoe20_2.png'], description: '클래식한 실루엣에 포근함을 더한 코듀로이 크루저. 하루의 스타일을 차분하고 편안하게 완성합니다.' },
      { name: '남성 플랜트 페이서', price: 150000, discountRate: 48, categories: ['lifestyle'], materials: ['캔버스'], availableSizes: [250, 260, 270], images: ['/uploads/shoe21_1.png', '/uploads/shoe21_2.png'], description: '새로운 Plant Pacer를 만나보세요. 올버즈의 첫 식물성 가죽 소재는 NFW 파트너십과 함께 MIRUM®으로 만들었습니다. 천연 소재(천연고무, 식물성 오일, 농산부산물 등)를 사용한 식물성 가죽은 100% 플라스틱 제로, 100% 비건, 100% 클래식 스타일 소재입니다.' },
      { name: '남성 러너 NZ 코듀로이', price: 150000, discountRate: 48, categories: ['lifestyle'], materials: ['부드럽고 따뜻한 wool'], availableSizes: [250, 260, 270], images: ['/uploads/shoe22_1.png', '/uploads/shoe22_2.png'], description: '부드러움에 온기를 더한 코듀로이 러너. 매일의 발걸음을 한층 더 포근하게.' },
      { name: '남성 캔버스 페이서', price: 200000, discountRate: 30, categories: ['lifestyle', 'slip-on'], materials: ['가볍고 시원한 tree'], availableSizes: [260, 270, 280], images: ['/uploads/shoe23_1.png', '/uploads/shoe23_2.png'], description: '클래식하면서도 자신만의 개성을 표현할 수 있는 스타일의 신발입니다. 견고하면서도 편안한 천연소재로 만들어졌습니다.' },
      { name: '남성 트리 라운저', price: 170000, discountRate: 42, categories: ['lifestyle', 'slip-on'], materials: ['가볍고 시원한 tree'], availableSizes: [250, 260, 270], images: ['/uploads/shoe24_1.png', '/uploads/shoe24_2.png'], description: '트리 라운저(Tree Lounger)는 편하고 통기성이 뛰어나며 가벼운 슬립온 스니커즈입니다.' },

      // --- Image 5 ---
      { name: '남성 크루저 슬립온 코듀로이', price: 220000, discountRate: 30, categories: ['lifestyle'], materials: ['가볍고 시원한 tree'], availableSizes: [260, 270, 280], images: ['/uploads/shoe25_1.png', '/uploads/shoe25_2.png'], description: '단정함에 여유를 더한 코듀로이 슬립온. 하루의 움직임을 부드럽고 편안하게 완성합니다.' },
      { name: '남성 울 파이퍼 우븐', price: 220000, discountRate: 30, categories: ['lifestyle'], materials: ['부드럽고 따뜻한 wool'], availableSizes: [260, 270, 280], images: ['/uploads/shoe26_1.png', '/uploads/shoe26_2.png'], description: 'Piper 가족 중에 더 내구성이 뛰어난 Wool Piper Woven은 올버즈만의 부드러움과 포근함을 선사하면서 어떤 스타일에도 어울립니다.' },
      { name: '남성 울 러너 플러프', price: 220000, discountRate: 30, categories: ['slip-on'], materials: ['부드럽고 따뜻한 wool'], availableSizes: [260, 270, 280], images: ['/uploads/shoe27_1.png', '/uploads/shoe27_2.png'], description: '플러프(Fluff)는 베스트 울 스니커즈를 더 포근한 스타일로 즐길 수 있도록 디자인 되었습니다.' },
      { name: '남성 트리 플라이어', price: 220000, discountRate: 30, categories: ['lifestyle'], materials: ['부드럽고 따뜻한 wool'], availableSizes: [260, 270, 280], images: ['/uploads/shoe28_1.png', '/uploads/shoe28_2.png'], description: '트리 플라이어(Tree Flyer)는 리사이클 재료로 만든 새로운 Swiftfoam ™ 미드솔의 고성능 퍼포먼스 러닝화입니다.' },
      { name: '남성 트리 대셔 릴레이', price: 200000, discountRate: 30, categories: ['lifestyle', 'slip-on'], materials: ['부드럽고 따뜻한 wool'], availableSizes: [260, 270, 280], images: ['/uploads/shoe29_1.png', '/uploads/shoe29_2.png'], description: '트리 대셔 릴레이(Tree Dasher Relay)는 편하게 신을 수 있는 슬립온 스타일 러닝화입니다.' },
      { name: '남성 울 라운저', price: 200000, discountRate: 30, categories: ['lifestyle', 'slip-on'], materials: ['가볍고 시원한 tree'], availableSizes: [260, 270, 280], images: ['/uploads/shoe30_1.png', '/uploads/shoe30_2.png'], description: '울 라운저(Wool Lounger)는 부드러운 ZQ 메리노 울로 만든 편안한 슬립온입니다.' },

      // --- Image 6 ---
      { name: '남성 울 라운저 우븐', price: 150000, discountRate: 48, categories: ['slip-on', 'lifestyle'], materials: ['부드럽고 따뜻한 wool'], availableSizes: [250, 260, 270], images: ['/uploads/shoe31_1.png', '/uploads/shoe31_2.png'], description: '울 라운저(Wool Lounger)는 부드러운 ZQ 메리노 울로 만든 편안한 슬립온입니다.' },
      { name: '남성 슈퍼라이트 울 러너', price: 150000, discountRate: 48, categories: ['slip-on'], materials: ['가볍고 시원한 tree'], availableSizes: [250, 260, 270], images: ['/uploads/shoe32_1.png', '/uploads/shoe32_2.png'], description: '자연이 만든 공기처럼 가벼운 착용감을 가진 슈퍼라이트 울 러너(SuperLight Wool Runner)는 통기성이 뛰어난 어퍼와 혁신적인 라이트폼이 적용되었습니다.' },
      { name: '남성 트리 토퍼', price: 200000, discountRate: 61, categories: ['lifestyle'], materials: ['부드럽고 따뜻한 wool'], availableSizes: [260, 270, 280], images: ['/uploads/shoe33_1.png', '/uploads/shoe33_2.png', '/uploads/shoe33_3.png'], description: 'Tree Topper는 미니멀리스트 하이탑으로 가볍고 통기성이 뛰어난 유칼립투스 나무 섬유로 만들었습니다. 따뜻한 날씨에 적합하며 캐주얼 웨어에 완벽한 데일리 워킹화입니다.' },
      { name: '남성 울 러너 업 미즐', price: 150000, discountRate: 48, categories: ['lifestyle'], materials: ['캔버스'], availableSizes: [250, 260, 270], images: ['/uploads/shoe34_1.png', '/uploads/shoe34_2.png'], description: '울 러너 업 미즐(Wool Runner-Up Mizzle)은 ZQ 메리노 울과 바이오 기반의 발수 쉴드로 만든 우천에 완벽한 하이탑 스니커즈입니다.' },
      { name: '남성 캔버스 페이서 미드', price: 150000, discountRate: 34, categories: ['lifestyle'], materials: ['부드럽고 따뜻한 wool'], availableSizes: [260, 270, 280], images: ['/uploads/shoe35_1.png', '/uploads/shoe35_2.png'], description: '내구성이 강한 천연 소재로 만든 클래식 실루엣. 언제, 어디에나 어울리는 신발.' },
      { name: '남성 트리 대셔', price: 170000, discountRate: 47, categories: ['lifestyle'], materials: ['가볍고 시원한 tree'], availableSizes: [260, 270, 280], images: ['/uploads/shoe36_1.png', '/uploads/shoe36_2.png'], description: '트리 대셔(Tree Dasher)는 편안함과 지지력이 뛰어난 러닝화로 데일리 러닝에 최적화된 신발입니다.' },
      { name: '남성 라이저', price: 170000, discountRate: 54, categories: ['slip-on'], materials: ['캔버스'], availableSizes: [250, 260, 270, 280], images: ['/uploads/shoe37_1.png', '/uploads/shoe37_2.png'], description: '날카로운 디자인과 지속 가능한 소재가 만나 우리의 가장 모험적인 신발이 탄생했습니다. 말 그대로입니다. 개성넘치는 스타일과 함께 지구에 가벼운 발자국을 남겨보세요.' },
      { name: '남성 트리 파이퍼', price: 170000, discountRate: 54, categories: ['slip-on'], materials: ['플라스틱 제로 식물성 가죽'], availableSizes: [260, 270, 280, 290], images: ['/uploads/shoe38_1.png', '/uploads/shoe38_2.png', '/uploads/shoe38_3.png'], description: '트리 파이퍼(Tree Piper)는 클래식 로우탑 디자인을 재해석한 따뜻한 날씨에 적합한 데일리 캐주얼 스니커즈입니다.' }
    ];

    const ps = await Product.insertMany(productsData);
    console.log(`✅ 상품 ${ps.length}개 데이터 생성 완료`);

    // 4. 풍부한 사전 주문 데이터 생성 (관리자 통계용)
    const today = new Date();
    const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
    const lastWeek = new Date(today); lastWeek.setDate(today.getDate() - 7);
    const lastMonth = new Date(today); lastMonth.setMonth(today.getMonth() - 1);

    const ordersData = [];

    // (1) 오늘: 김철수 (울 파이퍼 2개)
    const p1 = ps[0]; 
    const p1Price = p1.price * (1 - p1.discountRate / 100);
    ordersData.push({
      userId: u1,
      items: [{ productId: p1._id, name: p1.name, size: 260, quantity: 2, price: p1Price }],
      totalAmount: p1Price * 2,
      status: 'paid',
      orderedAt: today
    });

    // (2) 오늘: 이영희 (트리 라운저 1개 + 울 러너 1개) - 다중 상품 주문
    const p2 = ps[5];
    const p2Price = p2.price * (1 - p2.discountRate / 100);
    const p3 = ps[6];
    const p3Price = p3.price * (1 - p3.discountRate / 100);
    ordersData.push({
      userId: u2,
      items: [
        { productId: p2._id, name: p2.name, size: 250, quantity: 1, price: p2Price },
        { productId: p3._id, name: p3.name, size: 240, quantity: 1, price: p3Price }
      ],
      totalAmount: p2Price + p3Price,
      status: 'paid',
      orderedAt: today
    });

    // (3) 어제: 박지민 (트리 스키퍼 1개)
    const p4 = ps[9];
    const p4Price = p4.price * (1 - p4.discountRate / 100);
    ordersData.push({
      userId: u3,
      items: [{ productId: p4._id, name: p4.name, size: 270, quantity: 1, price: p4Price }],
      totalAmount: p4Price,
      status: 'paid',
      orderedAt: yesterday
    });

    // (4) 어제: 김철수 (올 라운저 1개)
    const p5 = ps[17];
    const p5Price = p5.price * (1 - p5.discountRate / 100);
    ordersData.push({
      userId: u1,
      items: [{ productId: p5._id, name: p5.name, size: 260, quantity: 1, price: p5Price }],
      totalAmount: p5Price,
      status: 'paid',
      orderedAt: yesterday
    });

    // (5) 지난주: 이영희 (스트라이더 1개)
    const p6 = ps[29];
    const p6Price = p6.price * (1 - p6.discountRate / 100);
    ordersData.push({
      userId: u2,
      items: [{ productId: p6._id, name: p6.name, size: 230, quantity: 1, price: p6Price }],
      totalAmount: p6Price,
      status: 'paid',
      orderedAt: lastWeek
    });

    // (6) 지난달: 김철수 (트리 플라이어 1개) - 기간 조회 필터링 테스트용
    const p7 = ps[15];
    const p7Price = p7.price * (1 - p7.discountRate / 100);
    ordersData.push({
      userId: u1,
      items: [{ productId: p7._id, name: p7.name, size: 280, quantity: 1, price: p7Price }],
      totalAmount: p7Price,
      status: 'paid',
      orderedAt: lastMonth
    });

    await Order.insertMany(ordersData);

    // 5. 상품 판매량(soldCount) 업데이트 (정렬용)
    // 간단하게 위에서 주문된 상품들의 카운트만 수동으로 올려줍니다.
    await Product.findByIdAndUpdate(p1._id, { $inc: { soldCount: 2 } });
    await Product.findByIdAndUpdate(p2._id, { $inc: { soldCount: 1 } });
    await Product.findByIdAndUpdate(p3._id, { $inc: { soldCount: 1 } });
    await Product.findByIdAndUpdate(p4._id, { $inc: { soldCount: 1 } });
    await Product.findByIdAndUpdate(p5._id, { $inc: { soldCount: 1 } });
    await Product.findByIdAndUpdate(p6._id, { $inc: { soldCount: 1 } });
    await Product.findByIdAndUpdate(p7._id, { $inc: { soldCount: 1 } });

    console.log('✅ 사전 주문/매출 데이터 생성 완료 (오늘, 어제, 지난주, 지난달 데이터 포함)');
    console.log('🎉 모든 초기 데이터 주입이 끝났습니다. 프로그램을 종료합니다.');
    process.exit();

  } catch (error) {
    console.error('데이터 주입 중 에러 발생:', error);
    process.exit(1);
  }
};