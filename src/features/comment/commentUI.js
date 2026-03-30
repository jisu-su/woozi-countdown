import { CommentService } from './commentService.js';

/**
 * 댓글 관련 UI 및 이벤트 제어 로직
 */
export const CommentUI = {
    /**
     * 댓글 목록을 화면에 렌더링합니다.
     */
    async renderComments(getDDayString) {
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
    },

    /**
     * 댓글 삭제 처리 함수
     */
    async handleDelete(id, getDDayString) {
        if (confirm("이 소중한 응원을 삭제할까요?")) {
            const success = await CommentService.deleteComment(id);
            if (success) {
                this.renderComments(getDDayString);
            } else {
                alert("삭제에 실패했습니다. 다시 시도해주세요.");
            }
        }
    },

    /**
     * 댓글 시스템 초기화 및 이벤트 바인딩
     */
    init(getDDayString) {
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
                    this.renderComments(getDDayString);
                } catch (e) {
                    alert("댓글 저장에 실패했습니다.");
                }
            });
        }

        // 댓글 삭제 버튼 (이벤트 위임)
        const commentList = document.getElementById('comment-list');
        if (commentList) {
            commentList.addEventListener('click', (e) => {
                if (e.target.classList.contains('delete-btn')) {
                    const id = e.target.getAttribute('data-id');
                    this.handleDelete(id, getDDayString);
                }
            });
        }
    }
};
