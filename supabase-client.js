// Supabase 클라이언트 설정
import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js@2';

// 환경 변수에서 Supabase 설정 가져오기
const supabaseUrl = window.SUPABASE_CONFIG?.url || 'https://pislpfnstcguhziglbms.supabase.co';
const supabaseKey = window.SUPABASE_CONFIG?.anonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpc2xwZm5zdGNndWh6aWdsYm1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2OTAzMDEsImV4cCI6MjA3NjI2NjMwMX0.x7vqSGk_OOzsm2fr0MawPwwPktb6k_sj5kF_TrylfL8';

// Supabase 클라이언트 생성
export const supabase = createClient(supabaseUrl, supabaseKey);

// 연결 상태 확인 함수
export async function checkSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('stock_prices')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Supabase 연결 오류:', error);
      return false;
    }
    
    console.log('Supabase 연결 성공');
    return true;
  } catch (err) {
    console.error('Supabase 연결 예외:', err);
    return false;
  }
}

// 주식 데이터 가져오기 함수
export async function fetchStocks() {
  try {
    const { data, error } = await supabase
      .from('stock_prices')
      .select('*')
      .order('team_id');
    
    if (error) {
      console.error('주식 데이터 가져오기 오류:', error);
      return null;
    }
    
    return data;
  } catch (err) {
    console.error('주식 데이터 가져오기 예외:', err);
    return null;
  }
}

// 투자 내역 저장 함수
export async function saveInvestment(investmentData) {
  try {
    const { data, error } = await supabase
      .from('investments')
      .insert([investmentData]);
    
    if (error) {
      console.error('투자 내역 저장 오류:', error);
      return false;
    }
    
    console.log('투자 내역 저장 성공');
    return true;
  } catch (err) {
    console.error('투자 내역 저장 예외:', err);
    return false;
  }
}

// 투자 내역 가져오기 함수
export async function fetchInvestments() {
  try {
    const { data, error } = await supabase
      .from('investments')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('투자 내역 가져오기 오류:', error);
      return null;
    }
    
    return data;
  } catch (err) {
    console.error('투자 내역 가져오기 예외:', err);
    return null;
  }
}
