-- Board Posts RLS 활성화 및 정책
ALTER TABLE board_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read board posts" ON board_posts;
CREATE POLICY "Anyone can read board posts" ON board_posts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert board posts" ON board_posts;
CREATE POLICY "Anyone can insert board posts" ON board_posts FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update board posts" ON board_posts;
CREATE POLICY "Anyone can update board posts" ON board_posts FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Anyone can delete board posts" ON board_posts;
CREATE POLICY "Anyone can delete board posts" ON board_posts FOR DELETE USING (true);

-- Guestbook Entries RLS 활성화 및 정책
ALTER TABLE guestbook_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read guestbook entries" ON guestbook_entries;
CREATE POLICY "Anyone can read guestbook entries" ON guestbook_entries FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert guestbook entries" ON guestbook_entries;
CREATE POLICY "Anyone can insert guestbook entries" ON guestbook_entries FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update guestbook entries" ON guestbook_entries;
CREATE POLICY "Anyone can update guestbook entries" ON guestbook_entries FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Anyone can delete guestbook entries" ON guestbook_entries;
CREATE POLICY "Anyone can delete guestbook entries" ON guestbook_entries FOR DELETE USING (true);