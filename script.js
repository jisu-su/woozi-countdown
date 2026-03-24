// 1. 페이지 전환 함수
function showPage(pageId) {
    const allPages = document.querySelectorAll('.page');
    allPages.forEach(p => {
        p.classList.remove('active');
        p.style.display = 'none'; 
    });

    const target = document.getElementById(pageId);
    if (!target) return;

    target.classList.add('active');

    const sidebar = document.getElementById('main-sidebar');
    if (pageId === 'timer-page') {
        sidebar.style.display = 'none';
        target.style.display = 'flex'; 
    } else {
        sidebar.style.display = 'flex';
        target.style.display = 'block'; 
    }
}

// 메인 클릭 시 이동
function goToMeal() {
    showPage('meal-page');
}

// 2. 카운트다운 로직 (2027년 3월 14일 전역일 기준)
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
        clockEl.innerHTML = `${d}d ${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
    }
}
setInterval(updateCountdown, 1000);

// 3. 소통창 댓글 시스템 (저장 및 불러오기)
function addComment() {
    const input = document.getElementById('comment-input');
    const text = input.value.trim();
    
    if (!text) return;

    // 로컬 스토리지에서 기존 데이터 가져오기
    const comments = JSON.parse(localStorage.getItem('woozi_comments') || '[]');
    
    // 새 댓글 추가 (내용, 날짜)
    comments.unshift({ 
        text: text, 
        date: new Date().toLocaleString() 
    });
    
    // 로컬 스토리지에 다시 저장
    localStorage.setItem('woozi_comments', JSON.stringify(comments));
    
    input.value = ''; // 입력창 비우기
    loadComments();   // 목록 새로고침
}

function deleteComment(index) {
    if(confirm("이 소중한 응원을 삭제할까요?")) {
        let comments = JSON.parse(localStorage.getItem('woozi_comments') || '[]');
        comments.splice(index, 1);
        localStorage.setItem('woozi_comments', JSON.stringify(comments));
        loadComments();
    }
}

function loadComments() {
    const list = document.getElementById('comment-list');
    if(!list) return;

    const comments = JSON.parse(localStorage.getItem('woozi_comments') || '[]');
    
    if (comments.length === 0) {
        list.innerHTML = '<p style="text-align:center; color:#999; padding:20px;">첫 번째 응원을 남겨보세요! 💎</p>';
        return;
    }

    list.innerHTML = comments.map((c, index) => `
        <div class="comment-item" style="background: white; padding: 15px; border-radius: 15px; margin-bottom: 12px; position: relative; border-left: 6px solid var(--rose-quartz); box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
            <p style="margin-bottom: 5px; color: #333;">${c.text}</p>
            <small style="color: #999; font-size: 0.8rem;">${c.date}</small>
            <button class="delete-btn" onclick="deleteComment(${index})" style="position: absolute; top: 12px; right: 15px; background: #ffebeb; color: #ff6b6b; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; font-size: 0.8rem;">삭제</button>
        </div>
    `).join('');
}

// [중요] 페이지 로드 시 실행될 초기화 로직
document.addEventListener('DOMContentLoaded', () => {
    // 1. 저장된 댓글 목록 불러오기 (이게 없어서 그동안 안 보였던 거예요!)
    loadComments();
    
    // 2. 카운트다운 즉시 실행
    updateCountdown();
    
    // 3. 식단표 초기화 (meals.js가 로드되어 있다면)
    if (typeof renderWeeklyCalendar === 'function') {
        renderWeeklyCalendar();
    }
});