# 파트너즈 증권 거래소 PWA

실시간 주식 거래 시뮬레이션 게임으로 팀별 투자 성과를 확인할 수 있는 Progressive Web App입니다.

## 🚀 GitHub Pages 배포 가이드

### 1. GitHub 저장소 설정

1. GitHub에 새 저장소를 생성합니다
2. 이 프로젝트 파일들을 저장소에 업로드합니다
3. 저장소 설정에서 Pages를 활성화합니다:
   - Settings → Pages → Source: "GitHub Actions" 선택

### 2. Supabase 환경 변수 설정

GitHub 저장소의 Secrets에 다음 환경 변수를 추가합니다:

1. GitHub 저장소 → Settings → Secrets and variables → Actions
2. 다음 시크릿을 추가합니다:
   - `SUPABASE_URL`: Supabase 프로젝트 URL
   - `SUPABASE_ANON_KEY`: Supabase 익명 키

### 3. Supabase 데이터베이스 설정

Supabase 대시보드에서 다음 테이블들을 생성합니다:

#### stock_prices 테이블
```sql
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
```

#### investments 테이블
```sql
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
```

#### 샘플 데이터 삽입
```sql
INSERT INTO stock_prices (team_id, team_name, display_name, current_price, previous_price) VALUES
(1, 'TJR', 'TJR', 1000, 1000),
(2, 'HZMB', 'HZMB', 1000, 1000),
(3, 'KHH', 'KHH', 1000, 1000),
(4, 'JCPK', 'JCPK', 1000, 1000),
(5, 'JMAI', 'JMAI', 1000, 1000),
(6, '6조', 'OXZ', 1000, 1000),
(7, 'FKR', 'FKR', 1000, 1000),
(8, 'YWSH', 'YWSH', 1000, 1000);
```

### 4. 자동 배포

1. `main` 브랜치에 코드를 푸시하면 자동으로 GitHub Actions가 실행됩니다
2. 배포가 완료되면 `https://[사용자명].github.io/[저장소명]`에서 앱에 접근할 수 있습니다

### 5. PWA 기능

- **오프라인 지원**: Service Worker를 통한 캐싱
- **앱 설치**: 홈 화면에 앱으로 설치 가능
- **실시간 업데이트**: Socket.IO를 통한 실시간 주가 변동
- **반응형 디자인**: 모바일과 데스크톱 모두 지원

## 🔧 로컬 개발

### 요구사항
- Node.js 18+
- npm

### 설치 및 실행
```bash
# 의존성 설치
npm install

# 개발 서버 시작
npm start
```

서버는 `http://localhost:3001`에서 실행됩니다.

## 📱 PWA 설치 방법

### 모바일 (Android/iOS)
1. 브라우저에서 앱에 접속
2. 브라우저 메뉴에서 "홈 화면에 추가" 선택
3. 또는 설치 프롬프트가 나타나면 "설치하기" 클릭

### 데스크톱 (Chrome/Edge)
1. 주소창 오른쪽의 설치 아이콘 클릭
2. 또는 설치 프롬프트가 나타나면 "설치" 클릭

## 🎯 주요 기능

- **실시간 주가 변동**: 15초마다 자동 업데이트
- **투자 시뮬레이션**: 팀별 투자 금액 입력
- **투자 내역 추적**: 모든 투자 기록 저장 및 조회
- **반응형 차트**: 주가 변동 시각화
- **팀별 순위**: 투자 성과 기반 순위 표시

## 🛠️ 기술 스택

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Backend**: Node.js, Express.js
- **Real-time**: Socket.IO
- **Database**: Supabase (PostgreSQL)
- **PWA**: Service Worker, Web App Manifest
- **Deployment**: GitHub Pages, GitHub Actions

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.
