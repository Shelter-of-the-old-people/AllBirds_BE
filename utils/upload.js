// utils/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 1. 이미지를 저장할 폴더가 없으면 자동으로 생성
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// 2. Multer 저장 설정 (어디에, 어떤 이름으로 저장할지)
const storage = multer.diskStorage({
  // 저장 위치
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  // 파일 이름 (중복 방지를 위해 현재 시간 + 원본 이름 사용)
  filename: (req, file, cb) => {
    // 예: 202510291230_shoe1.jpg
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); 
  }
});

// 3. 업로드 미들웨어 생성
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 파일 크기 제한 (5MB)
});

module.exports = upload;