// controllers/authController.js
const { User } = require('../models'); // 모델 불러오기

// 로그인 로직
exports.login = async (req, res) => {
  try {
    const { userId, password } = req.body;
    const user = await User.findOne({ userId });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "아이디 또는 비밀번호가 일치하지 않습니다." });
    }

    // 세션 저장
    req.session.user = {
      _id: user._id,
      userId: user.userId,
      name: user.name,
      isAdmin: user.isAdmin
    };

    req.session.save(() => {
      res.status(200).json({ message: "로그인 성공", user: req.session.user });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 에러" });
  }
};

// 로그아웃 로직
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: "로그아웃 실패" });
    res.clearCookie('connect.sid');
    res.json({ message: "로그아웃 성공" });
  });
};

// 로그인 상태 확인 로직
exports.checkAuth = (req, res) => {
  if (req.session.user) {
    res.json({ isLogin: true, user: req.session.user });
  } else {
    res.json({ isLogin: false, user: null });
  }
};