import { CommentUI } from './src/features/comment/commentUI.js';

/**
 * 우지 전역일 카운트다운 및 앱 메인 매니저
 * 파일 경로: script.js
 *
 * 주요 기능:
 * 1. 실시간 D-Day 카운트다운 계산 및 업데이트
 * 2. 💎 다이아몬드 버튼을 통한 페이지 전환 (토글)
 * 3. 댓글 시스템(CommentUI) 초기화 및 렌더링 호출
 */

// 목표로 하는 전역 날짜 설정
const targetDate = new Date("March 14, 2027 00:00:00").getTime();

// 1. [유틸리티] 현재 시점의 D-Day 문자열을 반환 (예: "D-340")
// 이 함수는 댓글 시스템에서 날짜별로 댓글을 구분할 때 중요하게 쓰입니다.
export function getDDayString() {
    const now = new Date().getTime();
    const distance = targetDate - now;
    const d = Math.floor(distance / (1000 * 60 * 60 * 24));
    return `D-${d}`;
}

// 2. [타이머] 카운트다운 업데이트 로직
function updateCountdown() {
    const now = new Date().getTime(); // 현재 시각
    const distance = targetDate - now; // 목표 전역일과의 시각 차이

    // 밀리초 단위를 시, 분, 초 단위로 변환해 화면에 출력
    const d = Math.floor(distance / (1000 * 60 * 60 * 24));
    const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((distance % (1000 * 60)) / 1000);

    const clockEl = document.getElementById("clock");
    
    if(clockEl) {
        if (distance < 0) {
            clockEl.innerHTML = "그가 왔다!"; // 전역일이 지난 경우
        } else {
            // 시간을 "00d 00:00:00" 형식으로 강제 변환하여 화면에 표시
            clockEl.innerHTML = `${d}d ${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
        }
    }
}

// 3. [관리자] 화면 전환 및 초기화 제어
const AppManager = {
    /**
     * 특정 페이지를 활성화하고 나머지는 숨깁니다.
     * @param {string} pageId - 활성화할 섹션의 ID (예: 'fan-page')
     */
    showPage(pageId) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        const target = document.getElementById(pageId);
        if (target) target.classList.add('active');
    },

    /**
     * 앱 초기화 함수 (최초 로드 시 1회 실행)
     */
    init() {
        // [1] 카운트다운 루프 시작 (1초마다 갱신)
        updateCountdown();
        setInterval(updateCountdown, 1000);

        // [2] 댓글 UI 시스템 초기화 (이벤트 바인딩)
        CommentUI.init(getDDayString);

        // [3] 다이아몬드 버튼(💎) 클릭 : 타이머 <-> 소통창 전환
        const diamondBtn = document.getElementById('diamond-btn');
        if (diamondBtn) {
            diamondBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // 배경 클릭 이벤트와 겹치지 않게 방지
                const fanPage = document.getElementById('fan-page');
                
                if (fanPage.classList.contains('active')) {
                    this.showPage('timer-page'); // 이미 열려있다면 타이머로 돌아가기
                } else {
                    this.showPage('fan-page'); // 열려있지 않다면 소통창 열기
                    CommentUI.renderComments(getDDayString); // 최신 댓글 목록 불러오기 요청
                }
            });
        }

        // [4] 배경(여백) 클릭 시 소통창 닫기
        document.addEventListener('click', (e) => {
            const fanPage = document.getElementById('fan-page');
            const diamondBtn = document.getElementById('diamond-btn');

            if (fanPage && fanPage.classList.contains('active')) {
                // 상자 외부를 눌렀는지 체크
                if (!fanPage.contains(e.target) && !diamondBtn.contains(e.target)) {
                    this.showPage('timer-page');
                }
            }
        });
    }
};

// [start] 페이지 로딩이 완료되면 앱 매니저를 가동합니다.
document.addEventListener('DOMContentLoaded', () => {
    AppManager.init();
});
