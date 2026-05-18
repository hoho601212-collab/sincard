# 📋 핀토스 프로젝트 - 필수 작업 목록

> **반드시 해야 하는 작업만 포함**

---

## 🔴 이미지 추출 (필수)

### 필요한 이미지 목록

```bash
/public/
├── logo.png                    # Header 로고
├── hero-image.png             # HeroSection 결제 일러스트
└── brands/                    # 브랜드 로고들
    ├── cultureland.png        # 컬쳐랜드
    ├── google-play.png        # 구글 기프트카드
    ├── book-and-life.png      # 북앤라이프 도서문화상품권
    ├── egg-money.png          # 에그머니
    ├── tmoneygo.png          # 티머니GO
    ├── pin-card.png          # 핀카드
    ├── happy-money.png        # 해피머니
    └── smart-cultureland.png  # 스마트문화상품권
```

### 추출 방법

1. Figma 디자인 파일 열기
2. 각 이미지/로고 선택
3. 우클릭 > Export > PNG (2x 또는 SVG)
4. 위 경로에 저장

---

## ✅ 완료된 작업

- [x] 모든 디자인 시스템 컴포넌트 개발 (18개)
- [x] Pretendard Variable 폰트 설정
- [x] Tailwind 색상 팔레트 추가

---

## 🚀 개발 서버 실행

```bash
npm run dev
# http://localhost:3000
```

---

## 📝 체크리스트

- [ ] **이미지 추출** (logo.png, hero-image.png, 브랜드 로고 8개)

---

## 📞 문제 발생 시

- 이미지가 안 보이면 → `/public/` 경로 확인
- 개발 서버 오류 → `npm run dev` 재실행
