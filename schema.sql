-- 댓글 테이블 스키마
CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dday TEXT NOT NULL,         -- D-340 같은 날짜 식별자
    text TEXT NOT NULL,         -- 댓글 내용
    author TEXT DEFAULT '익명', -- 작성자 (필요시)
    date TEXT NOT NULL          -- 작성 날짜 및 시간
);

-- 인덱스 추가 (조회 성능 향상)
CREATE INDEX IF NOT EXISTS idx_comments_dday ON comments(dday);
