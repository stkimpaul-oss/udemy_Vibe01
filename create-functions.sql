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