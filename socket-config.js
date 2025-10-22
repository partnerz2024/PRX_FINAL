// Socket.IO 서버 설정
const SOCKET_CONFIG = {
  // 개발 환경
  development: 'http://localhost:3001',
  
  // 프로덕션 환경 (Railway 배포 URL로 변경 필요)
  production: 'https://your-app.railway.app',
  
  // 현재 환경 감지
  getCurrentUrl: function() {
    const hostname = window.location.hostname;
    
    // 로컬 개발 환경
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return this.development;
    }
    
    // GitHub Pages 환경
    if (hostname.includes('github.io')) {
      return this.production;
    }
    
    // 기본값
    return this.production;
  }
};

// Socket.IO 연결
const socket = io(SOCKET_CONFIG.getCurrentUrl(), {
  transports: ['websocket', 'polling'],
  timeout: 20000,
  forceNew: true
});

// 연결 상태 모니터링
socket.on('connect', () => {
  console.log('✅ Socket.IO 서버에 연결되었습니다:', socket.id);
});

socket.on('disconnect', (reason) => {
  console.log('❌ Socket.IO 서버 연결이 끊어졌습니다:', reason);
});

socket.on('connect_error', (error) => {
  console.error('❌ Socket.IO 연결 오류:', error);
});

// 전역 변수로 socket 노출
window.socket = socket;
