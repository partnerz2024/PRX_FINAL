-- Supabase 데이터베이스 스키마 생성 스크립트
-- 이 스크립트를 Supabase SQL Editor에서 실행하세요

-- stocks 테이블 생성
CREATE TABLE IF NOT EXISTS stocks (
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

-- investments 테이블 생성
CREATE TABLE IF NOT EXISTS investments (
  id SERIAL PRIMARY KEY,
  team_id TEXT NOT NULL,
  team_name TEXT NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 샘플 주식 데이터 삽입
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
('FOX', 'FOX', 550, 550, 0, 0, 0)
ON CONFLICT (id) DO NOTHING;

-- RLS (Row Level Security) 정책 설정
ALTER TABLE stocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기/쓰기 가능하도록 정책 설정
CREATE POLICY "Enable read access for all users" ON stocks FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON stocks FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON stocks FOR UPDATE USING (true);

CREATE POLICY "Enable read access for all users" ON investments FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON investments FOR INSERT WITH CHECK (true);
