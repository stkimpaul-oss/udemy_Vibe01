-- ======================================
-- Vibe_01 프로젝트 데이터베이스 마이그레이션
-- ======================================

-- 1. Board Posts 테이블 생성
-- 게시판 게시글을 저장하는 테이블
CREATE TABLE IF NOT EXISTS board_posts (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  content TEXT NOT NULL CHECK (length(content) <= 2000),
  like_count INTEGER DEFAULT 0 NOT NULL CHECK (like_count >= 0),
  liked_by TEXT[] DEFAULT '{}' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ,

  -- 제약 조건
  CONSTRAINT title_not_empty CHECK (length(trim(title)) > 0),
  CONSTRAINT content_not_empty CHECK (length(trim(content)) > 0)
);

-- Board Posts 인덱스
CREATE INDEX IF NOT EXISTS idx_board_posts_created_at ON board_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_board_posts_like_count ON board_posts(like_count DESC);

-- Board Posts에 대한 Row Level Security (RLS) 활성화
ALTER TABLE board_posts ENABLE ROW LEVEL SECURITY;

-- Board Posts 읽기 정책 (모두 읽기 가능)
CREATE POLICY "Anyone can read board posts" ON board_posts
  FOR SELECT USING (true);

-- Board Posts 쓰기 정책 (모두 작성 가능)
CREATE POLICY "Anyone can insert board posts" ON board_posts
  FOR INSERT WITH CHECK (true);

-- Board Posts 업데이트 정책 (모두 업데이트 가능)
CREATE POLICY "Anyone can update board posts" ON board_posts
  FOR UPDATE USING (true);

-- Board Posts 삭제 정책 (모두 삭제 가능)
CREATE POLICY "Anyone can delete board posts" ON board_posts
  FOR DELETE USING (true);

-- ======================================

-- 2. Guestbook Entries 테이블 생성
-- 방명록 메시지를 저장하는 테이블
CREATE TABLE IF NOT EXISTS guestbook_entries (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  message TEXT NOT NULL CHECK (length(message) <= 500),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- 제약 조건
  CONSTRAINT name_not_empty CHECK (length(trim(name)) > 0),
  CONSTRAINT message_not_empty CHECK (length(trim(message)) > 0)
);

-- Guestbook Entries 인덱스
CREATE INDEX IF NOT EXISTS idx_guestbook_entries_created_at ON guestbook_entries(created_at DESC);

-- Guestbook Entries에 대한 Row Level Security (RLS) 활성화
ALTER TABLE guestbook_entries ENABLE ROW LEVEL SECURITY;

-- Guestbook Entries 읽기 정책 (모두 읽기 가능)
CREATE POLICY "Anyone can read guestbook entries" ON guestbook_entries
  FOR SELECT USING (true);

-- Guestbook Entries 쓰기 정책 (모두 작성 가능)
CREATE POLICY "Anyone can insert guestbook entries" ON guestbook_entries
  FOR INSERT WITH CHECK (true);

-- Guestbook Entries 업데이트 정책 (모두 업데이트 가능)
CREATE POLICY "Anyone can update guestbook entries" ON guestbook_entries
  FOR UPDATE USING (true);

-- Guestbook Entries 삭제 정책 (모두 삭제 가능)
CREATE POLICY "Anyone can delete guestbook entries" ON guestbook_entries
  FOR DELETE USING (true);

-- ======================================

-- 3. 유용한 함수들

-- Board Post의 좋아요를 토글하는 함수
CREATE OR REPLACE FUNCTION toggle_board_post_like(
  post_id BIGINT,
  user_id TEXT
)
RETURNS TABLE (
  new_like_count INTEGER,
  is_liked BOOLEAN
) AS $$
DECLARE
  user_index INTEGER;
  current_liked_by TEXT[];
  current_like_count INTEGER;
BEGIN
  -- 현재 liked_by 배열과 like_count 가져오기
  SELECT liked_by, like_count INTO current_liked_by, current_like_count
  FROM board_posts
  WHERE id = post_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Post not found with id: %', post_id;
  END IF;

  -- 배열에서 user_id의 인덱스 찾기 (1-based index, 없으면 NULL)
  user_index := array_position(current_liked_by, user_id);

  IF user_index IS NULL THEN
    -- 좋아요 추가
    UPDATE board_posts
    SET
      liked_by = array_append(liked_by, user_id),
      like_count = like_count + 1
    WHERE id = post_id;

    RETURN QUERY SELECT current_like_count + 1, true;
  ELSE
    -- 좋아요 취소
    UPDATE board_posts
    SET
      liked_by = array_remove(liked_by, user_id),
      like_count = like_count - 1
    WHERE id = post_id;

    RETURN QUERY SELECT current_like_count - 1, false;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- ======================================

-- 완료 메시지
DO $$
BEGIN
  RAISE NOTICE '===================================';
  RAISE NOTICE 'Vibe_01 데이터베이스 마이그레이션 완료!';
  RAISE NOTICE '생성된 테이블:';
  RAISE NOTICE '  - board_posts';
  RAISE NOTICE '  - guestbook_entries';
  RAISE NOTICE '생성된 함수:';
  RAISE NOTICE '  - toggle_board_post_like()';
  RAISE NOTICE '===================================';
END $$;
