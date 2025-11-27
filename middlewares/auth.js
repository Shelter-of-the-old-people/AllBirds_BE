// middlewares/auth.js

// 1. 로그인 여부 확인 (일반 고객용 문지기)
exports.isAuthenticated = (req, res, next) => {
  // 세션에 유저 정보가 없으면 튕겨냅니다.
  if (!req.session.user) {
    return res.status(401).json({ message: "로그인이 필요합니다." });
  }
  // 통과! 다음 로직으로 이동
  next();
};

// 2. 관리자 권한 확인 (관리자용 문지기)
exports.isAdmin = (req, res, next) => {
  // 1) 로그인은 했는지?
  if (!req.session.user) {
    return res.status(401).json({ message: "로그인이 필요합니다." });
  }
  // 2) 관리자가 맞는지?
  if (!req.session.user.isAdmin) {
    return res.status(403).json({ message: "관리자 권한이 없습니다." });
  }
  // 통과!
  next();
};