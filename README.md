# 파트너즈 증권 거래소 PWA

Socket.IO와 Supabase가 연결된 실시간 주식 거래 시뮬레이션 PWA 애플리케이션입니다.

## 기능

- 📊 실시간 주식 가격 업데이트
- 💰 실시간 투자 기능
- 📱 PWA 지원 (오프라인 사용 가능)
- 🔄 Socket.IO를 통한 실시간 통신
- 🗄️ Supabase 데이터베이스 연동

## 기술 스택

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Backend**: Node.js, Express
- **Real-time**: Socket.IO
- **Database**: Supabase
- **PWA**: Service Worker, Web App Manifest

## 배포

### GitHub Pages + Railway

1. **Socket.IO 서버 배포 (Railway)**
   - Railway에 `server.js` 배포
   - 환경 변수 설정 (SUPABASE_URL, SUPABASE_ANON_KEY)

2. **프론트엔드 배포 (GitHub Pages)**
   - 자동 배포 설정 완료
   - `main` 브랜치 푸시 시 자동 배포

### 로컬 실행

```bash
npm install
npm start
```

서버: `http://localhost:3001`
