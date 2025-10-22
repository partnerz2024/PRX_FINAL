# 🚀 GitHub Pages PWA 배포 완료 가이드

파트너즈 증권 거래소 PWA를 GitHub Pages에 성공적으로 배포하기 위한 단계별 가이드입니다.

## ✅ 완료된 설정

### 1. PWA 설정 완료
- ✅ `manifest.json` - 앱 메타데이터 및 설치 정보
- ✅ `sw.js` - Service Worker로 오프라인 지원
- ✅ PWA 설치 프롬프트 - 사용자에게 앱 설치 안내
- ✅ 반응형 디자인 - 모바일/데스크톱 최적화

### 2. GitHub Actions 워크플로우 설정
- ✅ 자동 빌드 및 배포 파이프라인
- ✅ Supabase 환경 변수 보안 처리
- ✅ 정적 파일 최적화

### 3. Supabase 클라이언트 설정
- ✅ 클라이언트 사이드 Supabase 연결
- ✅ 환경 변수 기반 설정
- ✅ 오프라인 지원

## 📋 배포 단계

### 1단계: GitHub 저장소 생성
```bash
# 새 저장소 생성 (GitHub 웹에서)
# 저장소명: partners-stock-pwa (또는 원하는 이름)
```

### 2단계: 코드 업로드
```bash
# 현재 프로젝트 폴더에서
git init
git add .
git commit -m "Initial commit: Partners Stock PWA"
git branch -M main
git remote add origin https://github.com/[사용자명]/[저장소명].git
git push -u origin main
```

### 3단계: Supabase 환경 변수 설정
1. GitHub 저장소 → Settings → Secrets and variables → Actions
2. 다음 시크릿 추가:
   - `SUPABASE_URL`: `https://pislpfnstcguhziglbms.supabase.co`
   - `SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpc2xwZm5zdGNndWh6aWdsYm1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2OTAzMDEsImV4cCI6MjA3NjI2NjMwMX0.x7vqSGk_OOzsm2fr0MawPwwPktb6k_sj5kF_TrylfL8`

### 4단계: GitHub Pages 활성화
1. GitHub 저장소 → Settings → Pages
2. Source: "GitHub Actions" 선택
3. 저장

### 5단계: Supabase 데이터베이스 설정
Supabase 대시보드에서 다음 SQL 실행:

```sql
-- stock_prices 테이블 생성
CREATE TABLE stock_prices (
  id SERIAL PRIMARY KEY,
  team_id INTEGER NOT NULL,
  team_name TEXT NOT NULL,
  display_name TEXT,
  current_price DECIMAL(10,2) NOT NULL,
  previous_price DECIMAL(10,2),
  change_percent DECIMAL(5,2) DEFAULT 0,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- investments 테이블 생성
CREATE TABLE investments (
  id SERIAL PRIMARY KEY,
  team_id TEXT NOT NULL,
  team_name TEXT NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  new_price DECIMAL(10,2),
  price_change DECIMAL(10,2),
  price_change_percent DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 샘플 데이터 삽입
INSERT INTO stock_prices (team_id, team_name, display_name, current_price, previous_price) VALUES
(1, 'TJR', 'TJR', 1000, 1000),
(2, 'HZMB', 'HZMB', 1000, 1000),
(3, 'KHH', 'KHH', 1000, 1000),
(4, 'JCPK', 'JCPK', 1000, 1000),
(5, 'JMAI', 'JMAI', 1000, 1000),
(6, '6조', 'OXZ', 1000, 1000),
(7, 'FKR', 'FKR', 1000, 1000),
(8, 'YWSH', 'YWSH', 1000, 1000);

-- RLS (Row Level Security) 정책 설정
ALTER TABLE stock_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기/쓰기 가능하도록 설정
CREATE POLICY "Allow all operations on stock_prices" ON stock_prices FOR ALL USING (true);
CREATE POLICY "Allow all operations on investments" ON investments FOR ALL USING (true);
```

### 6단계: 자동 배포 확인
1. 코드를 푸시하면 자동으로 GitHub Actions가 실행됩니다
2. Actions 탭에서 배포 상태를 확인할 수 있습니다
3. 배포 완료 후 `https://[사용자명].github.io/[저장소명]`에서 앱에 접근 가능합니다

## 🎯 배포 후 확인사항

### ✅ PWA 기능 테스트
1. **앱 설치**: 브라우저에서 설치 프롬프트 확인
2. **오프라인 지원**: 네트워크 끊고 앱 동작 확인
3. **실시간 업데이트**: 주가 변동 실시간 확인
4. **투자 기능**: 투자 입력 및 내역 확인

### ✅ 모바일 최적화 확인
1. **반응형 디자인**: 다양한 화면 크기에서 테스트
2. **터치 인터페이스**: 모바일에서 조작 편의성 확인
3. **성능**: 모바일에서 로딩 속도 확인

## 🔧 문제 해결

### 일반적인 문제들

#### 1. Supabase 연결 오류
```javascript
// 브라우저 콘솔에서 확인
console.log(window.SUPABASE_CONFIG);
```

#### 2. Service Worker 등록 실패
- HTTPS 환경에서만 작동합니다
- GitHub Pages는 자동으로 HTTPS를 제공합니다

#### 3. PWA 설치 프롬프트가 나타나지 않음
- Chrome DevTools → Application → Manifest에서 확인
- Service Worker가 정상 등록되었는지 확인

#### 4. 실시간 업데이트가 작동하지 않음
- Supabase 데이터베이스 연결 상태 확인
- Socket.IO 연결 상태 확인

## 📱 사용자 가이드

### 앱 설치 방법
1. **모바일 (Android/iOS)**:
   - 브라우저에서 앱 접속
   - 브라우저 메뉴 → "홈 화면에 추가"
   - 또는 설치 프롬프트에서 "설치하기" 클릭

2. **데스크톱 (Chrome/Edge)**:
   - 주소창 오른쪽 설치 아이콘 클릭
   - 또는 설치 프롬프트에서 "설치" 클릭

### 주요 기능 사용법
1. **주가 확인**: 메인 화면에서 실시간 주가 변동 확인
2. **투자하기**: 원하는 팀 선택 후 투자 금액 입력
3. **투자 내역**: 히스토리 탭에서 모든 투자 기록 확인
4. **순위 확인**: 팀별 투자 성과 순위 확인

## 🎉 배포 완료!

이제 파트너즈 증권 거래소 PWA가 GitHub Pages에서 완전히 작동합니다!

- **URL**: `https://[사용자명].github.io/[저장소명]`
- **PWA 기능**: 완전 지원
- **실시간 업데이트**: Supabase 연동
- **모바일 최적화**: 완료
- **오프라인 지원**: Service Worker 활성화

모든 사용자가 이제 웹 브라우저나 모바일 앱으로 접근하여 실시간 투자 시뮬레이션을 즐길 수 있습니다! 🚀
