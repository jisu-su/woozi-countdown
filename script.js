const targetDate = new Date("March 14, 2027 00:00:00").getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    const d = Math.floor(distance / (1000 * 60 * 60 * 24));
    const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((distance % (1000 * 60)) / 1000);

    const clockEl = document.getElementById("clock");
    
    if(clockEl) {
        // 전역일이 지났을 경우 처리
        if (distance < 0) {
            clockEl.innerHTML = "그가 온다";
        } else {
            clockEl.innerHTML = `${d}d ${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
        }
    }
}

setInterval(updateCountdown, 1000);

document.addEventListener('DOMContentLoaded', () => {
    updateCountdown();
});