# Supabase 데이터베이스 설정 가이드

이 문서는 Vibe_01 프로젝트의 Supabase 데이터베이스를 설정하는 방법을 안내합니다.

## 1. Supabase 프로젝트 설정

### 1.1 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Supabase URL과 Anon Key 찾는 방법:**
1. [Supabase 대시보드](https://app.supabase.com)에 로그인
2. `Vibe_01` 프로젝트 선택
3. 왼쪽 메뉴에서 **Settings** > **API** 클릭
4. **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`에 복사
5. **Project API keys** > **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`에 복사

### 1.2 데이터베이스 테이블 생성

Supabase 대시보드에서 SQL 편집기를 사용하여 테이블을 생성합니다:

1. Supabase 대시보드에서 왼쪽 메뉴의 **SQL Editor** 클릭
2. **New query** 버튼 클릭
3. 프로젝트 루트의 `supabase-migrations.sql` 파일 내용을 복사하여 붙여넣기
4. **Run** 버튼 클릭하여 실행

또는 Supabase MCP가 연결된 경우, 다음 명령어로 실행할 수 있습니다:

```bash
# MCP를 통한 마이그레이션 실행 (MCP 설정이 되어있는 경우)
mcp-supabase query --project vibe_01 --file supabase-migrations.sql
```

## 2. 생성되는 데이터베이스 구조

### 2.1 Board Posts 테이블 (`board_posts`)

게시판 게시글을 저장하는 테이블입니다.

**컬럼:**
- `id`: 게시글 고유 ID (자동 증가)
- `title`: 게시글 제목 (최대 100자)
- `content`: 게시글 내용 (최대 2000자)
- `like_count`: 좋아요 수
- `liked_by`: 좋아요한 사용자 ID 배열
- `created_at`: 생성 시각
- `updated_at`: 수정 시각

**인덱스:**
- `created_at` (최신 게시글 빠른 조회)
- `like_count` (인기 게시글 정렬)

### 2.2 Guestbook Entries 테이블 (`guestbook_entries`)

방명록 메시지를 저장하는 테이블입니다.

**컬럼:**
- `id`: 방명록 고유 ID (자동 증가)
- `name`: 작성자 이름 (최대 50자)
- `message`: 방명록 메시지 (최대 500자)
- `created_at`: 작성 시각

**인덱스:**
- `created_at` (최신 방명록 빠른 조회)

### 2.3 데이터베이스 함수

#### `toggle_board_post_like(post_id, user_id)`

게시글의 좋아요를 토글하는 함수입니다.

**사용법:**
```sql
SELECT * FROM toggle_board_post_like(1, 'user-123');
```

**반환값:**
- `new_like_count`: 업데이트된 좋아요 수
- `is_liked`: 좋아요 상태 (true/false)

## 3. Row Level Security (RLS) 정책

모든 테이블에 RLS가 활성화되어 있으며, 다음 정책이 적용됩니다:

- ✅ **읽기**: 누구나 가능
- ✅ **쓰기**: 누구나 가능
- ✅ **수정**: 누구나 가능
- ✅ **삭제**: 누구나 가능

> **참고**: 프로덕션 환경에서는 보다 엄격한 RLS 정책을 적용하는 것을 권장합니다.

## 4. API 엔드포인트 연동

다음 파일들이 Supabase와 연동되도록 수정되었습니다:

- ✅ `lib/supabase.ts` - Supabase 클라이언트 설정
- ✅ `lib/board.ts` - 게시판 로직
- ✅ `lib/guestbook.ts` - 방명록 로직

기존 API 엔드포인트는 그대로 유지되며, 백엔드 데이터 저장소만 메모리에서 Supabase로 변경되었습니다.

## 5. 개발 서버 실행

환경 변수 설정과 데이터베이스 마이그레이션이 완료되면:

```bash
npm run dev
```

## 6. 확인 사항

설정이 완료되면 다음을 확인하세요:

1. ✅ `.env.local` 파일이 생성되고 올바른 값이 설정되었는지
2. ✅ Supabase 대시보드에서 테이블이 생성되었는지 확인
3. ✅ 개발 서버를 실행하여 API가 정상 작동하는지 테스트

## 7. 트러블슈팅

### 문제: "Supabase URL과 Anon Key가 환경 변수에 설정되지 않았습니다."

**해결책:**
1. `.env.local` 파일이 프로젝트 루트에 있는지 확인
2. 파일 내용에 `NEXT_PUBLIC_` 접두사가 있는지 확인
3. 개발 서버를 재시작

### 문제: 데이터베이스 연결 오류

**해결책:**
1. Supabase 프로젝트가 활성화되어 있는지 확인
2. API 키가 올바른지 확인
3. 네트워크 연결 확인

### 문제: 테이블이 생성되지 않음

**해결책:**
1. SQL Editor에서 마이그레이션 스크립트를 다시 실행
2. 오류 메시지를 확인하여 문제 해결
3. 기존 테이블이 있다면 삭제 후 재생성

## 8. Vercel 배포 시 환경 변수 설정

Vercel에 배포할 때는 다음 단계를 따르세요:

1. Vercel 프로젝트 대시보드로 이동
2. **Settings** > **Environment Variables** 클릭
3. 다음 환경 변수 추가:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. 재배포

---

**참고 문서:**
- [Supabase 공식 문서](https://supabase.com/docs)
- [Next.js 환경 변수](https://nextjs.org/docs/basic-features/environment-variables)
