// 1. 목표 날짜 설정 (전역일 기준: 2027년 3월 14일 0시)
// new Date().getTime()은 1970년 1월 1일부터 해당 날짜까지의 시간을 밀리초(ms) 단위로 반환합니다.
const targetDate = new Date("March 14, 2027 00:00:00").getTime();

/**
 * 카운트다운을 계산하고 화면을 업데이트하는 함수
 */
function updateCountdown() {
    // 현재 시각을 밀리초 단위로 가져옴
    const now = new Date().getTime();
    
    // 목표 날짜와 현재 시각의 차이(남은 시간) 계산
    const distance = targetDate - now;

    // 밀리초 단위를 일, 시, 분, 초 단위로 변환
    // 1000ms * 60초 * 60분 * 24시간 = 하루치 밀리초
    const d = Math.floor(distance / (1000 * 60 * 60 * 24));
    const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((distance % (1000 * 60)) / 1000);

    // 시간을 표시할 HTML 요소를 ID("clock")로 찾음
    const clockEl = document.getElementById("clock");
    
    // 해당 요소가 페이지에 존재할 때만 실행
    if(clockEl) {
        // 전역일이 지났을 경우 (남은 시간이 0보다 작을 때) 처리
        if (distance < 0) {
            clockEl.innerHTML = "그가 온다"; // 종료 메시지 표시
        } else {
            // 남은 시간을 "00d 00:00:00" 형식으로 화면에 출력
            // .padStart(2, '0'): 한 자리 숫자일 경우 앞에 '0'을 붙여 두 자리로 유지
            clockEl.innerHTML = `${d}d ${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
        }
    }
}

// 2. 1초(1000ms)마다 updateCountdown 함수를 반복 실행하여 시간을 갱신
setInterval(updateCountdown, 1000);

// 3. 페이지의 HTML 구조가 모두 로드되었을 때 실행되는 초기화 로직
document.addEventListener('DOMContentLoaded', () => {
    // setInterval은 1초 후에 첫 실행되므로, 페이지를 열자마자 숫자가 보이도록 즉시 한 번 실행
    updateCountdown();
});