export interface BoardPost {
  id: number;
  title: string;
  content: string;
  likeCount: number;
  likedBy: string[]; // 좋아요한 사용자 ID 목록
  createdAt: string;
  updatedAt?: string;
}

// 메모리에 게시판 데이터 저장 (실제 프로덕션에서는 데이터베이스 사용)
let boardPosts: BoardPost[] = [];
let nextId = 1;

export function getAllPosts(): BoardPost[] {
  // 기존 게시글에 likedBy 필드가 없는 경우 초기화
  boardPosts.forEach((post) => {
    if (!post.likedBy) {
      post.likedBy = [];
    }
  });
  return boardPosts.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getPostById(id: number): BoardPost | undefined {
  return boardPosts.find((post) => post.id === id);
}

export function addPost(title: string, content: string): BoardPost {
  const post: BoardPost = {
    id: nextId++,
    title: title.trim(),
    content: content.trim(),
    likeCount: 0,
    likedBy: [],
    createdAt: new Date().toISOString(),
  };
  boardPosts.push(post);
  return post;
}

export function updatePost(id: number, title: string, content: string): BoardPost | null {
  const post = boardPosts.find((p) => p.id === id);
  if (!post) {
    return null;
  }
  post.title = title.trim();
  post.content = content.trim();
  post.updatedAt = new Date().toISOString();
  return post;
}

export function deletePost(id: number): boolean {
  const index = boardPosts.findIndex((p) => p.id === id);
  if (index === -1) {
    return false;
  }
  boardPosts.splice(index, 1);
  return true;
}

export function toggleLike(id: number, userId: string): { post: BoardPost | null; isLiked: boolean } {
  console.log("=== toggleLike 호출 ===");
  console.log("요청된 게시글 ID:", id, "타입:", typeof id);
  console.log("사용자 ID:", userId);
  
  // 먼저 getAllPosts를 호출하여 likedBy 초기화 및 최신 상태 확인
  // 이렇게 하면 게시글 목록이 최신 상태로 업데이트됨
  const allPosts = getAllPosts();
  console.log("getAllPosts 호출 후 게시글 수:", allPosts.length);
  console.log("게시글 ID 목록:", allPosts.map(p => ({ id: p.id, type: typeof p.id, title: p.title })));
  
  // boardPosts 배열이 비어있지만 allPosts에는 있는 경우 (모듈 재로드 문제)
  // allPosts에서 직접 찾기
  let post = boardPosts.find((p) => {
    const match = p.id === id || p.id === Number(id) || String(p.id) === String(id);
    return match;
  });
  
  // boardPosts에서 못 찾았으면 allPosts에서 찾기
  if (!post) {
    console.log("boardPosts에서 찾지 못함, allPosts에서 검색 시도...");
    const foundInAll = allPosts.find((p) => {
      const match = p.id === id || p.id === Number(id) || String(p.id) === String(id);
      return match;
    });
    
    if (foundInAll) {
      // allPosts에서 찾았으면 boardPosts에도 추가 (동기화)
      console.log("allPosts에서 게시글 발견, boardPosts에 동기화");
      post = foundInAll;
      // boardPosts에 없으면 추가
      if (!boardPosts.find(p => p.id === post!.id)) {
        boardPosts.push(post);
      }
    }
  }
  
  if (!post) {
    console.error("❌ 게시글을 찾을 수 없음!");
    console.error("요청된 ID:", id, "타입:", typeof id);
    console.error("boardPosts:", boardPosts.map(p => ({ id: p.id, type: typeof p.id, title: p.title })));
    console.error("allPosts:", allPosts.map(p => ({ id: p.id, type: typeof p.id, title: p.title })));
    return { post: null, isLiked: false };
  }
  
  console.log("✅ 게시글 찾음:", { id: post.id, title: post.title });
  
  // likedBy 배열이 없으면 초기화
  if (!post.likedBy) {
    post.likedBy = [];
  }
  
  const index = post.likedBy.indexOf(userId);
  if (index === -1) {
    // 좋아요 추가
    post.likedBy.push(userId);
    post.likeCount += 1;
    console.log("좋아요 추가 완료 - 현재 좋아요 수:", post.likeCount);
    return { post, isLiked: true };
  } else {
    // 좋아요 취소
    post.likedBy.splice(index, 1);
    post.likeCount -= 1;
    console.log("좋아요 취소 완료 - 현재 좋아요 수:", post.likeCount);
    return { post, isLiked: false };
  }
}

export function isLikedByUser(id: number, userId: string): boolean {
  const post = boardPosts.find((p) => p.id === id);
  if (!post) {
    return false;
  }
  return post.likedBy.includes(userId);
}

export function clearAllPosts(): boolean {
  boardPosts = [];
  nextId = 1;
  return true;
}

