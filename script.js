import { CommentUI } from './src/features/comment/commentUI.js';

/**
 * 우지 전역일 카운트다운 및 앱 메인 엔트리
 *
 * 주요 기능:
 * 1. 실시간 D-Day 카운트다운
 * 2. 💎 버튼을 통한 페이지 전환 (토글)
 * 3. 소통창 외부 클릭 시 닫기
 * 4. 모듈화된 댓글 시스템 초기화
 */

const targetDate = new Date("March 14, 2027 00:00:00").getTime();

// 1. 유틸리티: 현재 D-Day 문자열 반환 (예: "D-340")
// 댓글 시스템에서도 이 함수를 사용하여 날짜별 파티셔닝을 수행합니다.
export function getDDayString() {
    const now = new Date().getTime();
    const distance = targetDate - now;
    const d = Math.floor(distance / (1000 * 60 * 60 * 24));
    return `D-${d}`;
}

// 2. 카운트다운 업데이트 로직
function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    const d = Math.floor(distance / (1000 * 60 * 60 * 24));
    const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((distance % (1000 * 60)) / 1000);

    const clockEl = document.getElementById("clock");
    
    if(clockEl) {
        if (distance < 0) {
            clockEl.innerHTML = "그가 온다";
        } else {
            clockEl.innerHTML = `${d}d ${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
        }
    }
}

// 3. UI 및 페이지 제어
const AppManager = {
    /**
     * 특정 페이지로 전환합니다.
     */
    showPage(pageId) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        const target = document.getElementById(pageId);
        if (target) target.classList.add('active');
    },

    /**
     * 초기화 함수
     */
    init() {
        // 카운트다운 시작
        updateCountdown();
        setInterval(updateCountdown, 1000);

        // 댓글 UI 초기화
        CommentUI.init(getDDayString);

        // 다이아몬드 버튼 클릭: 소통창 토글
        const diamondBtn = document.getElementById('diamond-btn');
        if (diamondBtn) {
            diamondBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const fanPage = document.getElementById('fan-page');
                if (fanPage.classList.contains('active')) {
                    this.showPage('timer-page');
                } else {
                    this.showPage('fan-page');
                    CommentUI.renderComments(getDDayString);
                }
            });
        }

        // 전역 클릭 이벤트 (배경 클릭 시 닫기 및 가이드 제거)
        document.addEventListener('click', (e) => {
            const fanPage = document.getElementById('fan-page');
            const diamondBtn = document.getElementById('diamond-btn');

            // 소통창이 켜져 있고, 클릭한 대상이 소통창 내부나 다이아몬드 버튼이 아닐 때
            if (fanPage && fanPage.classList.contains('active')) {
                if (!fanPage.contains(e.target) && !diamondBtn.contains(e.target)) {
                    this.showPage('timer-page');
                }
            }

            // "Click anywhere to start" 가이드 텍스트 제거 (최초 클릭 시)
            const guideText = document.querySelector('.click-guide');
            if (guideText && guideText.style.display !== 'none') {
                guideText.style.display = 'none';
            }
        });
    }
};

// 4. 앱 부트스트랩
document.addEventListener('DOMContentLoaded', () => {
    AppManager.init();
});
