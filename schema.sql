-- [SQL] 댓글 저장용 테이블 스키마 정의
-- 파일 경로: schema.sql

CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT, -- 고유 번호 (자동 생성)
    dday TEXT NOT NULL,         -- D-340 같은 날짜 식별자 (D-Day별로 댓글을 구분함)
    text TEXT NOT NULL,         -- 실제 댓글 내용
    author TEXT DEFAULT '익명', -- 작성자 (현재는 기본값 '익명' 사용)
    date TEXT NOT NULL          -- 작성된 날짜 및 시간 (서버에서 전송됨)
);

-- [index] 특정 날짜의 댓글을 빠르게 찾아오기 위해 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_comments_dday ON comments(dday);
