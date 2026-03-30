/**
 * 우지 전역일 카운트다운 및 일일 댓글 시스템
 *
 * 주요 기능:
 * 1. 실시간 D-Day 카운트다운
 * 2. 날짜별(D-Day 기준) 독립된 댓글 저장소
 * 3. 💎 버튼을 통한 페이지 전환 및 바깥 클릭 시 닫기
 * 4. 외부 DB(Cloudflare Workers + D1) 연동
 */

const targetDate = new Date("March 14, 2027 00:00:00").getTime();

// 1. 유틸리티: 현재 D-Day 문자열 반환 (예: "D-340")
function getDDayString() {
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

// 3. 댓글 서비스 레이어 (Issue 3: Cloudflare Workers + D1 연동)
const CommentService = {
    apiEndpoint: '/api/comments',

    /**
     * 특정 날짜의 댓글 목록을 가져옵니다.
     */
    async fetchComments(dday) {
        try {
            const response = await fetch(`${this.apiEndpoint}?dday=${dday}`);
            if (!response.ok) throw new Error('Failed to fetch comments');
            return await response.json();
        } catch (error) {
            console.error('Error fetching comments:', error);
            return [];
        }
    },

    /**
     * 새로운 댓글을 저장합니다.
     */
    async saveComment(dday, text) {
        try {
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dday, text, date: new Date().toLocaleString() })
            });
            if (!response.ok) throw new Error('Failed to save comment');
            return await response.json();
        } catch (error) {
            console.error('Error saving comment:', error);
            throw error;
        }
    },

    /**
     * 특정 댓글을 삭제합니다.
     */
    async deleteComment(id) {
        try {
            const response = await fetch(`${this.apiEndpoint}/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete comment');
            return true;
        } catch (error) {
            console.error('Error deleting comment:', error);
            return false;
        }
    }
};

// 4. UI 및 페이지 제어 로직
const UIManager = {
    /**
     * 특정 페이지로 전환합니다.
     */
    showPage(pageId) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        const target = document.getElementById(pageId);
        if (target) target.classList.add('active');
    },

    /**
     * 댓글 목록을 화면에 렌더링합니다.
     */
    async renderComments() {
        const listContainer = document.getElementById('comment-list');
        if (!listContainer) return;

        const dday = getDDayString();
        const comments = await CommentService.fetchComments(dday);

        if (comments.length === 0) {
            listContainer.innerHTML = `<p style="text-align:center; color:#999; padding:20px;">${dday}의 첫 번째 응원을 남겨보세요! 💎</p>`;
            return;
        }

        listContainer.innerHTML = comments.map((c) => {
            // XSS 방지를 위한 텍스트 이스케이프
            const escapedText = c.text
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");

            return `
                <div class="comment-item">
                    <p>${escapedText}</p>
                    <small>${c.date}</small>
                    <button class="delete-btn" data-id="${c.id}">삭제</button>
                </div>
            `;
        }).join('');
    }
};

/**
 * 댓글 삭제 처리 함수
 */
async function handleDelete(id) {
    if (confirm("이 소중한 응원을 삭제할까요?")) {
        const success = await CommentService.deleteComment(id);
        if (success) {
            UIManager.renderComments();
        } else {
            alert("삭제에 실패했습니다. 다시 시도해주세요.");
        }
    }
}

// 5. 초기화 및 이벤트 리스너 설정
document.addEventListener('DOMContentLoaded', () => {
    // 카운트다운 시작
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // 다이아몬드 버튼 클릭: 소통창 토글
    const diamondBtn = document.getElementById('diamond-btn');
    if (diamondBtn) {
        diamondBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const fanPage = document.getElementById('fan-page');
            if (fanPage.classList.contains('active')) {
                UIManager.showPage('timer-page');
            } else {
                UIManager.showPage('fan-page');
                UIManager.renderComments();
            }
        });
    }

    // 댓글 등록 버튼
    const submitBtn = document.getElementById('submit-comment');
    const inputField = document.getElementById('comment-input');
    if (submitBtn && inputField) {
        submitBtn.addEventListener('click', async () => {
            const text = inputField.value.trim();
            if (!text) return;

            const dday = getDDayString();
            try {
                await CommentService.saveComment(dday, text);
                inputField.value = '';
                UIManager.renderComments();
            } catch (e) {
                alert("댓글 저장에 실패했습니다.");
            }
        });
    }

    // 소통창 바깥 영역(배경) 클릭 시 타이머로 돌아가기
    document.addEventListener('click', (e) => {
        const fanPage = document.getElementById('fan-page');
        const diamondBtn = document.getElementById('diamond-btn');

        // 소통창이 켜져 있고, 클릭한 대상이 소통창 내부나 다이아몬드 버튼이 아닐 때
        if (fanPage.classList.contains('active')) {
            if (!fanPage.contains(e.target) && !diamondBtn.contains(e.target)) {
                UIManager.showPage('timer-page');
            }
        }

        // "Click anywhere to start" 가이드 텍스트 제거 (최초 클릭 시)
        const guideText = document.querySelector('.click-guide');
        if (guideText && guideText.style.display !== 'none') {
            guideText.style.display = 'none';
        }
    });

    // 댓글 삭제 버튼 (이벤트 위임)
    const commentList = document.getElementById('comment-list');
    if (commentList) {
        commentList.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-btn')) {
                const id = e.target.getAttribute('data-id');
                handleDelete(id);
            }
        });
    }
});
