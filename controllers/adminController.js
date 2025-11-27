// controllers/adminController.js
const { Order } = require('../models');

// 판매 현황 집계 (기간별 필터링)
exports.getSalesStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // 1. 날짜 필터링 조건 설정
    // 클라이언트에서 날짜를 안 보내면 '전체 기간'을 조회하도록 설정
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        orderedAt: {
          $gte: new Date(startDate), // 시작일 00:00
          $lte: new Date(new Date(endDate).setHours(23, 59, 59)) // 종료일 23:59
        }
      };
    }

    // 2. MongoDB Aggregation (집계) 파이프라인 실행
    const stats = await Order.aggregate([
      {
        // (1) 조건에 맞는 주문만 골라내기 (기간 + 결제완료)
        $match: {
          status: 'paid',
          ...dateFilter
        }
      },
      {
        // (2) 주문 내의 items 배열을 낱개 문서로 분리
        // (주문 1개에 상품 3개가 있으면 -> 문서 3개로 쪼개짐)
        $unwind: "$items"
      },
      {
        // (3) 상품별로 그룹핑하여 합계 계산 [cite: 98]
        $group: {
          _id: "$items.productId", // 상품 ID 기준
          productName: { $first: "$items.name" }, // 상품명 (스냅샷) 가져오기
          totalQuantity: { $sum: "$items.quantity" }, // 판매수량 합계
          // 매출 합계: (할인 적용된 단가 * 수량)을 다 더함 [cite: 100]
          totalRevenue: { 
            $sum: { $multiply: ["$items.price", "$items.quantity"] } 
          }
        }
      },
      {
        // (4) 보기 좋게 정렬 (매출 높은 순)
        $sort: { totalRevenue: -1 }
      }
    ]);

    res.json(stats);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "판매 현황 집계 실패" });
  }
};