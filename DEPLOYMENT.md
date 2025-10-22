# 파트너즈 증권 거래소 PWA 배포 가이드

## GitHub Pages + Railway 배포 방법

### 1단계: Socket.IO 서버를 Railway에 배포

1. **Railway 계정 생성**
   - [Railway.app](https://railway.app) 방문
   - GitHub 계정으로 로그인

2. **새 프로젝트 생성**
   - "New Project" 클릭
   - "Deploy from GitHub repo" 선택
   - 이 저장소 선택

3. **환경 변수 설정**
   Railway 대시보드에서 다음 환경 변수 추가:
   ```
   SUPABASE_URL=https://pislpfnstcguhziglbms.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpc2xwZm5zdGNndWh6aWdsYm1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2OTAzMDEsImV4cCI6MjA3NjI2NjMwMX0.x7vqSGk_OOzsm2fr0MawPwwPktb6k_sj5kF_TrylfL8
   PORT=3001
   ```

4. **배포**
   - Railway가 자동으로 `server.js`를 감지하고 배포
   - 배포 완료 후 제공되는 URL 확인 (예: `https://your-app.railway.app`)

### 2단계: 프론트엔드를 GitHub Pages에 배포

1. **GitHub 저장소 설정**
   - Settings → Pages
   - Source: "GitHub Actions" 선택

2. **Socket.IO 서버 URL 업데이트**
   - Railway에서 받은 URL을 사용하여 `main.js`의 Socket.IO 연결 URL 수정

3. **자동 배포**
   - `main` 브랜치에 푸시하면 자동으로 GitHub Pages에 배포

### 3단계: PWA 설정 확인

- `manifest.json`: PWA 메타데이터 설정 완료
- `sw.js`: Service Worker 설정 완료
- `index.html`: PWA 관련 메타 태그 설정 완료

## 대안: Render 사용

Railway 대신 Render를 사용할 수도 있습니다:

1. [Render.com](https://render.com) 방문
2. GitHub 계정으로 로그인
3. "New Web Service" 선택
4. 이 저장소 연결
5. 환경 변수 설정 (Railway와 동일)
6. 배포

## 주의사항

- GitHub Pages는 정적 파일만 호스팅하므로 Socket.IO 서버는 별도 호스팅 필요
- 무료 티어는 제한이 있을 수 있음 (월 트래픽, 동시 연결 수 등)
- 프로덕션 환경에서는 유료 플랜 고려 권장

## 로컬 테스트

```bash
npm install
npm start
```

서버가 `http://localhost:3001`에서 실행됩니다.
