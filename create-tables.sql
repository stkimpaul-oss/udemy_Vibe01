-- Board Posts 테이블 생성
CREATE TABLE IF NOT EXISTS board_posts (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  content TEXT NOT NULL CHECK (length(content) <= 2000),
  like_count INTEGER DEFAULT 0 NOT NULL CHECK (like_count >= 0),
  liked_by TEXT[] DEFAULT '{}' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ,
  CONSTRAINT title_not_empty CHECK (length(trim(title)) > 0),
  CONSTRAINT content_not_empty CHECK (length(trim(content)) > 0)
);

-- Guestbook Entries 테이블 생성
CREATE TABLE IF NOT EXISTS guestbook_entries (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  message TEXT NOT NULL CHECK (length(message) <= 500),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT name_not_empty CHECK (length(trim(name)) > 0),
  CONSTRAINT message_not_empty CHECK (length(trim(message)) > 0)
);