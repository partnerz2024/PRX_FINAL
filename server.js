const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // 모든 origin 허용 (개발 환경용)
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
  },
  allowEIO3: true,
  allowEIO4: true,
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000,
  upgradeTimeout: 10000,
  maxHttpBufferSize: 1e6,
  serveClient: true
});

// Supabase 클라이언트 초기화
const supabaseUrl = process.env.SUPABASE_URL || 'https://pislpfnstcguhziglbms.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpc2xwZm5zdGNndWh6aWdsYm1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2OTAzMDEsImV4cCI6MjA3NjI2NjMwMX0.x7vqSGk_OOzsm2fr0MawPwwPktb6k_sj5kF_TrylfL8';
const supabase = createClient(supabaseUrl, supabaseKey);

// Supabase 연결 상태 모니터링
let supabaseConnectionStatus = 'unknown';
let lastSuccessfulConnection = null;

async function checkSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('stock_prices')
      .select('count')
      .limit(1);
    
    if (error) {
      supabaseConnectionStatus = 'error';
      console.error('🔴 Supabase 연결 상태: 오류 -', error.message);
    } else {
      supabaseConnectionStatus = 'connected';
      lastSuccessfulConnection = new Date();
      console.log('🟢 Supabase 연결 상태: 정상');
    }
  } catch (err) {
    supabaseConnectionStatus = 'error';
    console.error('🔴 Supabase 연결 상태: 예외 -', err.message);
  }
}

// 30초마다 연결 상태 확인
setInterval(checkSupabaseConnection, 30000);

// 미들웨어
app.use(cors({
  origin: "*", // 모든 origin 허용 (개발 환경용)
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));
app.use(express.json());

// 정적 파일 서빙 설정
app.use(express.static('.'));

// 초기화 상태 추적 변수
let isResetMode = false;

// 가상 주식 데이터 - 프론트엔드가 기대하는 형식으로 수정
let stocks = [
  { 
    id: 'T1', 
    name: 'T1', 
    current_price: 1000, 
    price_change: 0, 
    price_change_percent: 0, 
    change_percent: 0,
    total_investment: 0,
    price: 1000,
    change: 0,
    changePercent: 0,
    investment: 0
  },
  { 
    id: 'GEN.G', 
    name: 'GEN.G', 
    current_price: 950, 
    price_change: 0, 
    price_change_percent: 0, 
    change_percent: 0,
    total_investment: 0,
    price: 950,
    change: 0,
    changePercent: 0,
    investment: 0
  },
  { 
    id: 'DRX', 
    name: 'DRX', 
    current_price: 800, 
    price_change: 0, 
    price_change_percent: 0, 
    change_percent: 0,
    total_investment: 0,
    price: 800,
    change: 0,
    changePercent: 0,
    investment: 0
  },
  { 
    id: 'KT', 
    name: 'KT', 
    current_price: 750, 
    price_change: 0, 
    price_change_percent: 0, 
    change_percent: 0,
    total_investment: 0,
    price: 750,
    change: 0,
    changePercent: 0,
    investment: 0
  },
  { 
    id: 'DK', 
    name: 'DK', 
    current_price: 900, 
    price_change: 0, 
    price_change_percent: 0, 
    change_percent: 0,
    total_investment: 0,
    price: 900,
    change: 0,
    changePercent: 0,
    investment: 0
  },
  { 
    id: 'HLE', 
    name: 'HLE', 
    current_price: 850, 
    price_change: 0, 
    price_change_percent: 0, 
    change_percent: 0,
    total_investment: 0,
    price: 850,
    change: 0,
    changePercent: 0,
    investment: 0
  },
  { 
    id: 'KDF', 
    name: 'KDF', 
    current_price: 700, 
    price_change: 0, 
    price_change_percent: 0, 
    change_percent: 0,
    total_investment: 0,
    price: 700,
    change: 0,
    changePercent: 0,
    investment: 0
  },
  { 
    id: 'BRO', 
    name: 'BRO', 
    current_price: 650, 
    price_change: 0, 
    price_change_percent: 0, 
    change_percent: 0,
    total_investment: 0,
    price: 650,
    change: 0,
    changePercent: 0,
    investment: 0
  },
  { 
    id: 'NS', 
    name: 'NS', 
    current_price: 600, 
    price_change: 0, 
    price_change_percent: 0, 
    change_percent: 0,
    total_investment: 0,
    price: 600,
    change: 0,
    changePercent: 0,
    investment: 0
  },
  { 
    id: 'FOX', 
    name: 'FOX', 
    current_price: 550, 
    price_change: 0, 
    price_change_percent: 0, 
    change_percent: 0,
    total_investment: 0,
    price: 550,
    change: 0,
    changePercent: 0,
    investment: 0
  }
];

// 투자 내역 저장
let investments = [];

// 팀별 총 투자액 추적
let teamInvestments = {
  'TJR': 0,
  'HZMB': 0,
  'KHH': 0,
  'JCPK': 0,
  'JMAI': 0,
  'OXZ': 0,
  'FKR': 0,
  'YWSH': 0
};

// Supabase에서 주식 데이터 가져오기
async function fetchStocksFromSupabase() {
  const maxRetries = 3;
  let lastError = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Supabase에서 주식 데이터를 가져오는 중... (시도 ${attempt}/${maxRetries})`);
      
      const { data, error } = await supabase
        .from('stock_prices')
        .select('*')
        .order('team_id');
      
      if (error) {
        lastError = error;
        console.error(`Supabase 데이터 가져오기 오류 (시도 ${attempt}):`, error);
        
        if (attempt < maxRetries) {
          console.log(`${attempt * 1000}ms 후 재시도...`);
          await new Promise(resolve => setTimeout(resolve, attempt * 1000));
          continue;
        }
        return null;
      }
    
            // 데이터 형식을 프론트엔드가 기대하는 형식으로 변환
            const formattedData = data.map(stock => {
              // 6조를 OXZ로 변환
              const teamName = stock.team_name === '6조' ? 'OXZ' : stock.team_name;
              const displayName = stock.team_name === '6조' ? 'OX즈' : stock.team_name;
              
              // price_change가 없으면 계산
              const priceChange = stock.price_change !== null && stock.price_change !== undefined 
                ? stock.price_change 
                : (stock.current_price - (stock.previous_price || stock.current_price));
              
              return {
                id: stock.team_id.toString(),
                team_id: stock.team_id,
                name: displayName, // 종목명을 "OX즈"로 표시
                team_name: teamName,
                display_name: displayName,
                current_price: stock.current_price,
                price_change: priceChange,
                price_change_percent: stock.change_percent || 0,
                change_percent: stock.change_percent || 0,
                total_investment: teamInvestments[teamName] || 0,
                price: stock.current_price,
                change: priceChange,
                changePercent: stock.change_percent || 0,
                investment: teamInvestments[teamName] || 0,
                timestamp: stock.timestamp
              };
            });
    
      console.log('Supabase에서 가져온 데이터:', formattedData);
      return formattedData;
      
    } catch (err) {
      lastError = err;
      console.error(`Supabase 연결 오류 (시도 ${attempt}):`, err);
      
      if (attempt < maxRetries) {
        console.log(`${attempt * 1000}ms 후 재시도...`);
        await new Promise(resolve => setTimeout(resolve, attempt * 1000));
        continue;
      }
    }
  }
  
  console.error('모든 재시도 실패. 마지막 오류:', lastError);
  return null;
}

// 투자 내역은 로컬에서만 관리
async function fetchInvestmentsFromSupabase() {
  // 로컬 투자 내역을 시간순으로 정렬하여 반환
  return investments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

// 주가 업데이트 함수 - 더 현실적인 변동
function updateStockPrices() {
  stocks.forEach(stock => {
    // 이전 가격 저장
    const previousPrice = stock.price;
    
    // 팀별 변동성 설정 (인기 팀일수록 변동성 높음)
    const teamVolatility = {
      'T1': 0.015,      // 1.5%
      'GEN.G': 0.012,   // 1.2%
      'DRX': 0.010,     // 1.0%
      'KT': 0.008,      // 0.8%
      'DK': 0.009,      // 0.9%
      'HLE': 0.007,     // 0.7%
      'KDF': 0.006,     // 0.6%
      'BRO': 0.005,     // 0.5%
      'NS': 0.004,      // 0.4%
      'FOX': 0.003      // 0.3%
    };
    
    const baseVolatility = teamVolatility[stock.id] || 0.005;
    
    // 가끔 큰 변동 (5% 확률로 2-8% 변동)
    const isBigMove = Math.random() < 0.05;
    const volatility = isBigMove ? 
      (0.02 + Math.random() * 0.06) : // 2-8% 큰 변동
      (baseVolatility * 0.5 + Math.random() * baseVolatility); // 일반 변동
    
    // 방향성 (약간 상승 편향)
    const direction = (Math.random() - 0.4) * 2; // -0.8 ~ 1.2 (상승 편향)
    
    // 변동률에 따른 가격 변화
    const changePercent = direction * volatility * 100;
    const changeAmount = previousPrice * (changePercent / 100);
    
    // 새로운 가격 계산 (최소 50원, 최대 5000원)
    const newPrice = Math.max(50, Math.min(5000, previousPrice + changeAmount));
    
    // 실제 변화량과 변화율 계산
    const actualChange = newPrice - previousPrice;
    const actualChangePercent = (actualChange / previousPrice) * 100;
    
    // 기존 형식 업데이트
    stock.change = actualChange;
    stock.changePercent = actualChangePercent;
    stock.price = newPrice;
    
    // 프론트엔드가 기대하는 형식도 업데이트
    stock.current_price = newPrice;
    stock.price_change = actualChange;
    stock.price_change_percent = actualChangePercent;
    stock.change_percent = actualChangePercent;
  });
}

// API 엔드포인트
app.get('/api/stocks', async (req, res) => {
  try {
    // Supabase에서 최신 데이터 가져오기
    const supabaseData = await fetchStocksFromSupabase();
    
    if (supabaseData && supabaseData.length > 0) {
      // Supabase 데이터를 사용
      res.json(supabaseData);
    } else {
      // Supabase 데이터가 없으면 로컬 데이터 사용
      console.log('Supabase 데이터가 없어서 로컬 데이터를 사용합니다.');
      res.json(stocks);
    }
  } catch (error) {
    console.error('주식 데이터 가져오기 오류:', error);
    res.json(stocks); // 오류 시 로컬 데이터 반환
  }
});

app.post('/api/invest', async (req, res) => {
  const { teamId, amount } = req.body;
  
  if (!teamId || !amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid investment data' });
  }
  
  try {
    // Supabase에서 최신 주식 데이터 가져오기
    const supabaseData = await fetchStocksFromSupabase();
    if (!supabaseData || supabaseData.length === 0) {
      return res.status(500).json({ error: '주식 데이터를 가져올 수 없습니다.' });
    }
    
    // teamId로 주식 찾기 (더 유연한 매칭)
    const stock = supabaseData.find(s => 
      s.id === teamId || 
      s.id === teamId.toString() ||
      s.team_id.toString() === teamId || 
      s.team_id.toString() === teamId.toString() ||
      s.name === teamId ||
      s.team_name === teamId
    );
    
    if (!stock) {
      console.error(`주식을 찾을 수 없습니다. teamId: ${teamId} (${typeof teamId}), 사용 가능한 주식들:`, supabaseData.map(s => ({ 
        id: s.id, 
        team_id: s.team_id, 
        name: s.name, 
        team_name: s.team_name 
      })));
      return res.status(404).json({ error: 'Stock not found' });
    }
    
    console.log(`✅ 주식 찾음: ${stock.name} (ID: ${stock.id}, team_id: ${stock.team_id})`);
    
    // 투자 금액
    const investmentAmount = parseFloat(amount);
    
    // 투자에 따른 주가 변동 (상승 확률 60%, 하락 확률 40%)
    const isPriceUp = Math.random() < 0.6; // 60% 확률로 상승
    const priceChangePercent = isPriceUp ? 
      (0.5 + Math.random() * 2.5) : // 상승: 0.5% ~ 3% 
      -(0.3 + Math.random() * 1.7); // 하락: -0.3% ~ -2%
    
    const currentPrice = stock.current_price || stock.price;
    const priceChange = currentPrice * (priceChangePercent / 100);
    const newPrice = Math.max(50, Math.min(5000, currentPrice + priceChange));
    
    // 주식의 총 투자액 업데이트
    const newTotalInvestment = (stock.total_investment || 0) + investmentAmount;
    
    // 로컬 투자액 업데이트
    teamInvestments[stock.name] = (teamInvestments[stock.name] || 0) + investmentAmount;
    
    // 투자 내역 추가
    const investment = {
      id: Date.now(),
      teamId,
      teamName: stock.name,
      amount: investmentAmount,
      price: currentPrice,
      newPrice: newPrice,
      priceChange: priceChange,
      priceChangePercent: priceChangePercent,
      timestamp: new Date().toISOString()
    };
    
    // 로컬 투자 내역에 추가
    investments.push(investment);
    
    // 투자 내역은 로컬에서만 관리 (Supabase 테이블 구조 문제로 인해)
    console.log(`💰 ${stock.name} 투자: ${investmentAmount}원, 주가: ${currentPrice} → ${newPrice} (${priceChangePercent > 0 ? '+' : ''}${priceChangePercent.toFixed(2)}%)`);
    
    // Supabase에서 해당 주식의 주가 업데이트 (total_investment는 로컬에서만 관리)
    try {
      const { error: updateError } = await supabase
        .from('stock_prices')
        .update({
          current_price: newPrice,
          previous_price: currentPrice,
          change_percent: priceChangePercent,
          timestamp: new Date().toISOString()
        })
        .eq('team_name', stock.name);
      
      if (updateError) {
        console.error('Supabase 주가 업데이트 오류:', updateError);
      }
    } catch (updateError) {
      console.error('Supabase 주가 업데이트 중 예외:', updateError);
    }
    
    // 투자한 주식만 업데이트된 데이터로 전송
    const updatedStock = {
      ...stock,
      current_price: newPrice,
      previous_price: currentPrice,
      change_percent: priceChangePercent,
      price_change: priceChange,
      total_investment: newTotalInvestment,
      price: newPrice,
      change: priceChange,
      changePercent: priceChangePercent,
      investment: newTotalInvestment
    };
    
    // 해당 주식만 업데이트된 데이터를 전송
    io.emit('stockUpdate', updatedStock);
    io.emit('investmentUpdate', investment);
    
    res.json({ 
      success: true, 
      investment,
      updatedStock: updatedStock
    });
  } catch (error) {
    console.error('투자 처리 오류:', error);
    res.status(500).json({ error: '투자 처리 중 오류가 발생했습니다.' });
  }
});

app.get('/api/investments', async (req, res) => {
  try {
    // Supabase에서 최신 투자 내역 가져오기
    const supabaseInvestments = await fetchInvestmentsFromSupabase();
    
    if (supabaseInvestments && supabaseInvestments.length > 0) {
      // Supabase 데이터를 사용
      res.json(supabaseInvestments);
    } else {
      // Supabase 데이터가 없으면 로컬 데이터 사용
      res.json(investments);
    }
  } catch (error) {
    console.error('투자 내역 가져오기 오류:', error);
    res.json(investments); // 오류 시 로컬 데이터 반환
  }
});

// 히스토리 데이터 API (투자 내역과 동일)
app.get('/api/history', async (req, res) => {
  try {
    // Supabase에서 투자 내역 가져오기 시도
    const supabaseInvestments = await fetchInvestmentsFromSupabase();
    if (supabaseInvestments && supabaseInvestments.length > 0) {
      // Supabase 데이터를 사용
      res.json(supabaseInvestments);
    } else {
      // Supabase 데이터가 없으면 로컬 데이터 사용
      res.json(investments);
    }
  } catch (error) {
    console.error('히스토리 데이터 가져오기 오류:', error);
    res.json(investments); // 오류 시 로컬 데이터 반환
  }
});

// Supabase에 초기 주가 업데이트하는 함수
async function updateSupabaseStocks(initialPrices) {
  try {
    console.log('🔄 Supabase에 초기 주가를 업데이트하는 중...');
    
    // 각 팀별로 Supabase 업데이트
    for (const [teamName, price] of Object.entries(initialPrices)) {
      const { error } = await supabase
        .from('stock_prices')
        .update({
          current_price: price,
          previous_price: price,
          change_percent: 0,
          timestamp: new Date().toISOString()
        })
        .eq('team_name', teamName);
      
      if (error) {
        console.error(`❌ ${teamName} 업데이트 실패:`, error);
      } else {
        console.log(`✅ ${teamName}: ${price}원으로 초기화 완료`);
      }
    }
    
    console.log('🎉 Supabase 초기화 완료!');
    return true;
  } catch (error) {
    console.error('❌ Supabase 초기화 오류:', error);
    return false;
  }
}

// Supabase에 변동률만 업데이트하는 함수
async function updateSupabaseChangePercent() {
  const maxRetries = 2;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Supabase 변동률을 업데이트하는 중... (시도 ${attempt}/${maxRetries})`);
    
    // 각 팀별로 변동률 업데이트
    const teamVolatility = {
      'TJR': 0.10,      // 10%
      'HZMB': 0.10,     // 10%
      'KHH': 0.10,      // 10%
      'JCPK': 0.10,     // 10%
      'JMAI': 0.10,     // 10%
      'OXZ': 0.10,      // 10%
      'FKR': 0.10,      // 10%
      'YWSH': 0.10      // 10%
    };
    
    // 더 균등한 상승/하락 분배를 위해 Fisher-Yates 셔플 사용
    const teamNames = Object.keys(teamVolatility);
    
    // Fisher-Yates 셔플 알고리즘
    for (let i = teamNames.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [teamNames[i], teamNames[j]] = [teamNames[j], teamNames[i]];
    }
    
    // 3~6개 상승 주식 선택 (더 균등한 분배, 최소 3개 보장)
    const positiveCount = Math.floor(Math.random() * 4) + 3; // 3~6개
    const positiveTeams = teamNames.slice(0, positiveCount);
    
    console.log(`📈 상승 주식: ${positiveTeams.length}개 (${positiveTeams.join(', ')})`);
    
    for (const [teamName, volatility] of Object.entries(teamVolatility)) {
      let changePercent;
      
      if (positiveTeams.includes(teamName)) {
        // 상승: 0% ~ +10% 범위 (더 균등한 분배)
        changePercent = Math.random() * volatility * 100;
      } else {
        // 하락: -10% ~ 0% 범위 (더 균등한 분배)
        changePercent = -Math.random() * volatility * 100;
      }
      
      // 현재 가격 가져오기 (6조를 OXZ로 변환하여 조회)
      const actualTeamName = teamName === 'OXZ' ? '6조' : teamName;
      const { data: currentData, error: fetchError } = await supabase
        .from('stock_prices')
        .select('current_price')
        .eq('team_name', actualTeamName)
        .single();
      
      if (fetchError) {
        console.error(`현재 가격 조회 오류 (${teamName}):`, fetchError);
        // 재시도 로직 추가
        try {
          const retryData = await supabase
            .from('stock_prices')
            .select('current_price')
            .eq('team_name', actualTeamName)
            .single();
          
          if (retryData.error) {
            console.error(`재시도 실패 (${teamName}):`, retryData.error);
            continue;
          }
          currentData = retryData.data;
        } catch (retryError) {
          console.error(`재시도 중 예외 발생 (${teamName}):`, retryError);
          continue;
        }
      }
      
      const currentPrice = currentData.current_price;
      const newPrice = Math.max(50, Math.min(5000, currentPrice * (1 + changePercent / 100)));
      const actualChange = newPrice - currentPrice;
      const actualChangePercent = (actualChange / currentPrice) * 100;
      
      // Supabase에 업데이트
      const { error: updateError } = await supabase
        .from('stock_prices')
        .update({
          current_price: newPrice,
          previous_price: currentPrice,
          change_percent: actualChangePercent,
          timestamp: new Date().toISOString()
        })
        .eq('team_name', actualTeamName);
      
      if (updateError) {
        console.error(`변동률 업데이트 오류 (${teamName}):`, updateError);
      }
    }
    
      console.log('✅ Supabase 변동률 업데이트 완료');
      return; // 성공 시 함수 종료
      
    } catch (error) {
      console.error(`변동률 업데이트 오류 (시도 ${attempt}):`, error);
      
      if (attempt < maxRetries) {
        console.log(`${attempt * 1000}ms 후 재시도...`);
        await new Promise(resolve => setTimeout(resolve, attempt * 1000));
        continue;
      }
      
      console.error('모든 재시도 실패. 변동률 업데이트 중단');
    }
  }
}

// 주식 초기화 API (관리자 전용)
app.post('/api/reset-stocks', async (req, res) => {
  const { adminPassword } = req.body;
  
  // 관리자 암호 확인 (별도 암호)
  if (adminPassword !== 'reset2024!') {
    return res.status(401).json({ error: '관리자 권한이 없습니다.' });
  }
  
  try {
    // 초기 주가로 리셋 (모든 팀 1000원으로 통일)
    const initialPrices = {
      'TJR': 1000,
      'HZMB': 1000,
      'KHH': 1000,
      'JCPK': 1000,
      'JMAI': 1000,
      'OXZ': 1000,
      'FKR': 1000,
      'YWSH': 1000
    };
    
    // Supabase에 초기 주가 업데이트
    const supabaseSuccess = await updateSupabaseStocks(initialPrices);
    
    // 로컬 stocks 배열 초기화 (모든 주식 1000원으로)
    stocks.forEach(stock => {
      stock.current_price = 1000;
      stock.price = 1000;
      stock.change = 0;
      stock.changePercent = 0;
      stock.price_change = 0;
      stock.price_change_percent = 0;
      stock.change_percent = 0;
      // 투자 관련 필드는 유지 (주가만 초기화)
    });
    
    // 투자 내역은 초기화하지 않음 (주가만 초기화)
    
    // 초기화 모드 비활성화 (Supabase 데이터 사용)
    isResetMode = false;
    
    // 모든 클라이언트에게 초기화된 데이터 전송
    io.emit('stocksUpdate', stocks);
    io.emit('investmentsUpdate', investments);
    
    console.log('🔄 주식 데이터가 초기화되었습니다. (Supabase 업데이트 완료)');
    res.json({ 
      success: true, 
      message: '주식 데이터가 초기화되었습니다.',
      stocks: stocks,
      supabaseUpdated: supabaseSuccess
    });
  } catch (error) {
    console.error('주식 초기화 오류:', error);
    res.status(500).json({ error: '주식 초기화에 실패했습니다.' });
  }
});

// Supabase 연결 상태 확인 API
app.get('/api/connection-status', async (req, res) => {
  try {
    await checkSupabaseConnection();
    res.json({
      status: supabaseConnectionStatus,
      lastSuccessfulConnection: lastSuccessfulConnection,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// 팀명 업데이트 API (관리자 전용)
app.post('/api/update-team-name', async (req, res) => {
  const { oldName, newName, newDisplayName } = req.body;

  if (!oldName || !newName) {
    return res.status(400).json({ error: 'oldName과 newName이 필요합니다.' });
  }

  try {
    // Supabase에서 팀명 업데이트
    const { data, error } = await supabase
      .from('stock_prices')
      .update({ 
        team_name: newName,
        display_name: newDisplayName || newName
      })
      .eq('team_name', oldName);

    if (error) {
      console.error('팀명 업데이트 오류:', error);
      return res.status(500).json({ error: '팀명 업데이트에 실패했습니다.' });
    }

    console.log(`✅ 팀명 업데이트 완료: ${oldName} → ${newName}`);
    res.json({ success: true, message: `팀명이 ${oldName}에서 ${newName}으로 업데이트되었습니다.` });
  } catch (error) {
    console.error('팀명 업데이트 중 예외 발생:', error);
    res.status(500).json({ error: '팀명 업데이트에 실패했습니다.' });
  }
});

// Socket.IO 연결 처리
io.on('connection', async (socket) => {
  console.log('🟢 클라이언트 연결됨:', socket.id, 'IP:', socket.handshake.address);
  
  // 연결 시 Supabase에서 최신 주식 데이터 가져와서 전송
  try {
    const supabaseData = await fetchStocksFromSupabase();
    if (supabaseData && supabaseData.length > 0) {
      socket.emit('stocksUpdate', supabaseData);
      console.log(`✅ Supabase 데이터를 클라이언트 ${socket.id}에 전송했습니다. (${supabaseData.length}개 항목)`);
    } else {
      socket.emit('stocksUpdate', stocks);
      console.log(`⚠️ 로컬 데이터를 클라이언트 ${socket.id}에 전송했습니다.`);
    }
  } catch (error) {
    console.error('클라이언트 데이터 전송 오류:', error);
    socket.emit('stocksUpdate', stocks);
  }
  
  socket.emit('investmentsUpdate', investments);
  
  // 연결 오류 처리
  socket.on('connect_error', (error) => {
    console.error('🔴 Socket.IO 연결 오류:', error.message);
  });
  
  socket.on('disconnect', (reason) => {
    console.log('🔴 클라이언트 연결 해제됨:', socket.id, '이유:', reason);
  });
  
  // 에러 이벤트 처리
  socket.on('error', (error) => {
    console.error('🔴 Socket.IO 에러:', error);
  });
});

// 15초마다 주가 업데이트
setInterval(async () => {
  try {
    // 초기화 모드가 아닐 때만 Supabase 데이터 사용
    if (!isResetMode) {
      const supabaseData = await fetchStocksFromSupabase();
      if (supabaseData && supabaseData.length > 0) {
        io.emit('stocksUpdate', supabaseData);
        console.log(`📊 Supabase 데이터로 실시간 업데이트 전송 (${supabaseData.length}개 항목)`);
        return;
      }
    }
    
    // 초기화 모드이거나 Supabase 데이터가 없으면 로컬 데이터 업데이트
    updateStockPrices();
    io.emit('stocksUpdate', stocks);
    console.log('📊 로컬 데이터로 실시간 업데이트 전송');
  } catch (error) {
    console.error('실시간 업데이트 오류:', error);
    updateStockPrices();
    io.emit('stocksUpdate', stocks);
  }
}, 15000);

// 10초마다 변동률 업데이트 (Supabase에만)
setInterval(async () => {
  try {
    if (!isResetMode) {
      await updateSupabaseChangePercent();
    }
  } catch (error) {
    console.error('변동률 업데이트 오류:', error);
  }
}, 10000);

// 서버 시작
const PORT = 3001;
server.listen(PORT, async () => {
  console.log(`🚀 서버가 포트 ${PORT}에서 실행 중입니다!`);
  console.log(`📊 주가 API: http://localhost:${PORT}/api/stocks`);
  console.log(`💰 투자 API: http://localhost:${PORT}/api/invest`);
  console.log(`📈 투자 내역: http://localhost:${PORT}/api/investments`);
  
  // Supabase 연결 테스트
  console.log('🔗 Supabase 연결을 테스트하는 중...');
  const supabaseData = await fetchStocksFromSupabase();
  if (supabaseData) {
    console.log('✅ Supabase 연결 성공!');
    console.log(`📊 ${supabaseData.length}개의 주식 데이터를 가져왔습니다.`);
  } else {
    console.log('⚠️ Supabase 연결 실패 - 로컬 데이터를 사용합니다.');
  }
});
