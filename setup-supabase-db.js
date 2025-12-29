/**
 * Supabase 데이터베이스 설정 스크립트
 *
 * 이 스크립트는 Supabase 데이터베이스에 필요한 테이블, 인덱스, RLS 정책, 함수를 생성합니다.
 *
 * 사용법:
 * 1. .env.local 파일에 Supabase 연결 정보 설정
 * 2. node setup-supabase-db.js 실행
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// 환경 변수 로드
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ 오류: NEXT_PUBLIC_SUPABASE_URL과 SUPABASE_SERVICE_KEY (또는 NEXT_PUBLIC_SUPABASE_ANON_KEY)가 .env.local에 설정되지 않았습니다.');
  console.log('\n📝 .env.local 파일을 생성하고 다음 내용을 추가하세요:');
  console.log('NEXT_PUBLIC_SUPABASE_URL=your-supabase-url');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// SQL 파일 읽기
function readSQLFile(filename) {
  const filePath = path.join(__dirname, filename);
  return fs.readFileSync(filePath, 'utf8');
}

// SQL 실행
async function executeSQL(sql, description) {
  console.log(`\n🔄 ${description}...`);

  const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql }).catch(() => {
    // exec_sql 함수가 없으면 직접 실행 시도
    return { data: null, error: { message: 'exec_sql function not available' } };
  });

  if (error && error.message === 'exec_sql function not available') {
    console.log('⚠️  직접 SQL 실행을 시도합니다. Supabase SQL Editor를 사용하는 것을 권장합니다.');
    console.log('\n📋 다음 SQL을 Supabase 대시보드의 SQL Editor에서 실행하세요:');
    console.log('=====================================');
    console.log(sql);
    console.log('=====================================\n');
    return false;
  }

  if (error) {
    console.error(`❌ 오류: ${error.message}`);
    return false;
  }

  console.log(`✅ ${description} 완료`);
  return true;
}

async function setupDatabase() {
  console.log('🚀 Supabase 데이터베이스 설정을 시작합니다...\n');
  console.log(`📍 프로젝트 URL: ${supabaseUrl}\n`);

  let allSuccess = true;

  // 1. 테이블 생성
  const createTablesSQL = readSQLFile('create-tables.sql');
  const tablesSuccess = await executeSQL(createTablesSQL, '테이블 생성');
  allSuccess = allSuccess && tablesSuccess;

  // 2. 인덱스 생성
  const createIndexesSQL = readSQLFile('create-indexes.sql');
  const indexesSuccess = await executeSQL(createIndexesSQL, '인덱스 생성');
  allSuccess = allSuccess && indexesSuccess;

  // 3. RLS 정책 생성
  const createRLSSQL = readSQLFile('create-rls-policies.sql');
  const rlsSuccess = await executeSQL(createRLSSQL, 'RLS 정책 생성');
  allSuccess = allSuccess && rlsSuccess;

  // 4. 함수 생성
  const createFunctionsSQL = readSQLFile('create-functions.sql');
  const functionsSuccess = await executeSQL(createFunctionsSQL, '함수 생성');
  allSuccess = allSuccess && functionsSuccess;

  if (!allSuccess) {
    console.log('\n⚠️  일부 SQL을 자동으로 실행할 수 없습니다.');
    console.log('📋 Supabase 대시보드에서 수동으로 실행하세요:');
    console.log('   1. https://app.supabase.com 접속');
    console.log('   2. 프로젝트 선택');
    console.log('   3. SQL Editor 클릭');
    console.log('   4. 위에 표시된 SQL 실행');
    console.log('\n또는 전체 마이그레이션 파일 사용:');
    console.log('   supabase-migrations.sql 파일의 내용을 SQL Editor에 붙여넣기');
  } else {
    console.log('\n✅ 데이터베이스 설정이 완료되었습니다!');
    console.log('\n생성된 테이블:');
    console.log('  - board_posts (게시판)');
    console.log('  - guestbook_entries (방명록)');
    console.log('\n생성된 함수:');
    console.log('  - toggle_board_post_like() (좋아요 토글)');
  }

  console.log('\n🎉 이제 npm run dev로 개발 서버를 실행할 수 있습니다!\n');
}

// 테이블 존재 여부 확인
async function checkTables() {
  console.log('🔍 기존 테이블 확인 중...\n');

  const { data: boardPosts, error: boardError } = await supabase
    .from('board_posts')
    .select('id')
    .limit(1);

  const { data: guestbook, error: guestbookError } = await supabase
    .from('guestbook_entries')
    .select('id')
    .limit(1);

  const boardExists = !boardError;
  const guestbookExists = !guestbookError;

  console.log(`board_posts: ${boardExists ? '✅ 존재함' : '❌ 없음'}`);
  console.log(`guestbook_entries: ${guestbookExists ? '✅ 존재함' : '❌ 없음'}\n`);

  if (boardExists && guestbookExists) {
    console.log('✅ 모든 테이블이 이미 존재합니다!');
    console.log('💡 테이블을 다시 생성하려면 Supabase 대시보드에서 먼저 삭제하세요.\n');
    return true;
  }

  return false;
}

// 메인 실행
(async () => {
  try {
    const tablesExist = await checkTables();

    if (!tablesExist) {
      await setupDatabase();
    }
  } catch (error) {
    console.error('\n❌ 오류 발생:', error.message);
    console.log('\n💡 해결 방법:');
    console.log('  1. .env.local 파일에 올바른 Supabase 연결 정보가 있는지 확인');
    console.log('  2. Supabase 프로젝트가 활성화되어 있는지 확인');
    console.log('  3. 네트워크 연결 확인');
    console.log('\n또는 수동으로 설정:');
    console.log('  Supabase 대시보드 > SQL Editor > supabase-migrations.sql 실행');
    process.exit(1);
  }
})();
