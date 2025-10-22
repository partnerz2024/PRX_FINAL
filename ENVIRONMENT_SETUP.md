# 환경 변수 설정 가이드

## Railway 배포 시 필요한 환경 변수

Railway 대시보드에서 다음 환경 변수들을 설정하세요:

```
SUPABASE_URL=https://pislpfnstcguhziglbms.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpc2xwZm5zdGNndWh6aWdsYm1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2OTAzMDEsImV4cCI6MjA3NjI2NjMwMX0.x7vqSGk_OOzsm2fr0MawPwwPktb6k_sj5kF_TrylfL8
PORT=3001
NODE_ENV=production
```

## GitHub Pages 배포 후 설정

1. Railway에서 배포된 Socket.IO 서버 URL을 복사
2. `socket-config.js` 파일의 `production` URL을 Railway URL로 변경
3. 변경사항을 GitHub에 푸시하여 자동 재배포

## 배포 순서

1. **Railway에 서버 배포**
   - GitHub 저장소 연결
   - 환경 변수 설정
   - 배포 완료 후 URL 확인

2. **Socket.IO 서버 URL 업데이트**
   - `socket-config.js`에서 production URL 수정
   - GitHub에 푸시

3. **GitHub Pages 자동 배포**
   - GitHub Actions가 자동으로 배포 실행
   - Settings → Pages에서 배포 상태 확인

## 문제 해결

### Socket.IO 연결 실패
- Railway 서버가 정상 실행 중인지 확인
- 환경 변수가 올바르게 설정되었는지 확인
- CORS 설정이 올바른지 확인

### PWA 설치 실패
- HTTPS 환경에서만 PWA 설치 가능
- Service Worker가 정상 등록되었는지 확인
- manifest.json이 올바른지 확인
