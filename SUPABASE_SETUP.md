# Supabase 설정 가이드

## 1. Supabase 프로젝트 생성
1. [Supabase](https://supabase.com)에 가입하고 새 프로젝트를 생성하세요.

## 2. 환경 변수 설정
`.env` 파일을 수정하여 실제 Supabase 정보를 입력하세요:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

## 3. 데이터베이스 테이블 생성

### stocks 테이블
```sql
CREATE TABLE stocks (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  current_price DECIMAL(10,2) NOT NULL,
  price_change DECIMAL(10,2) DEFAULT 0,
  price_change_percent DECIMAL(5,2) DEFAULT 0,
  change_percent DECIMAL(5,2) DEFAULT 0,
  total_investment DECIMAL(15,2) DEFAULT 0,
  price DECIMAL(10,2) NOT NULL,
  change DECIMAL(10,2) DEFAULT 0,
  changePercent DECIMAL(5,2) DEFAULT 0,
  investment DECIMAL(15,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### investments 테이블
```sql
CREATE TABLE investments (
  id SERIAL PRIMARY KEY,
  team_id TEXT NOT NULL,
  team_name TEXT NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 4. 샘플 데이터 삽입
```sql
INSERT INTO stocks (id, name, current_price, price, change, changePercent, change_percent) VALUES
('T1', 'T1', 1000, 1000, 0, 0, 0),
('GEN.G', 'GEN.G', 950, 950, 0, 0, 0),
('DRX', 'DRX', 800, 800, 0, 0, 0),
('KT', 'KT', 750, 750, 0, 0, 0),
('DK', 'DK', 900, 900, 0, 0, 0),
('HLE', 'HLE', 850, 850, 0, 0, 0),
('KDF', 'KDF', 700, 700, 0, 0, 0),
('BRO', 'BRO', 650, 650, 0, 0, 0),
('NS', 'NS', 600, 600, 0, 0, 0),
('FOX', 'FOX', 550, 550, 0, 0, 0);
```

## 5. 서버 재시작
환경 변수를 설정한 후 서버를 재시작하세요:
```bash
npm start
```
