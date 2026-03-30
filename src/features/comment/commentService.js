/**
 * 댓글 서비스 레이어 (Issue 3: Cloudflare Workers + D1 연동)
 */
export const CommentService = {
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
                body: JSON.stringify({ 
                    dday, 
                    text, 
                    date: new Date().toLocaleString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        weekday: undefined,
                        hour: 'numeric',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: true
                    })
                })
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
