import { supabase } from './supabase';

export interface BoardPost {
  id: number;
  title: string;
  content: string;
  likeCount: number;
  likedBy: string[]; // 좋아요한 사용자 ID 목록
  createdAt: string;
  updatedAt?: string;
}

// Supabase 데이터베이스 응답 타입
interface DBBoardPost {
  id: number;
  title: string;
  content: string;
  like_count: number;
  liked_by: string[];
  created_at: string;
  updated_at?: string;
}

// DB 형식을 앱 형식으로 변환
function mapDBPostToPost(dbPost: DBBoardPost): BoardPost {
  return {
    id: dbPost.id,
    title: dbPost.title,
    content: dbPost.content,
    likeCount: dbPost.like_count,
    likedBy: dbPost.liked_by || [],
    createdAt: dbPost.created_at,
    updatedAt: dbPost.updated_at,
  };
}

export async function getAllPosts(): Promise<BoardPost[]> {
  try {
    const { data, error } = await supabase
      .from('board_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('게시글 조회 오류:', error);
      throw error;
    }

    return (data || []).map(mapDBPostToPost);
  } catch (error) {
    console.error('getAllPosts 오류:', error);
    return [];
  }
}

export async function getPostById(id: number): Promise<BoardPost | null> {
  try {
    const { data, error } = await supabase
      .from('board_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('게시글 조회 오류:', error);
      return null;
    }

    return data ? mapDBPostToPost(data) : null;
  } catch (error) {
    console.error('getPostById 오류:', error);
    return null;
  }
}

export async function addPost(title: string, content: string): Promise<BoardPost> {
  try {
    const { data, error } = await supabase
      .from('board_posts')
      .insert([
        {
          title: title.trim(),
          content: content.trim(),
          like_count: 0,
          liked_by: [],
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('게시글 작성 오류:', error);
      throw error;
    }

    return mapDBPostToPost(data);
  } catch (error) {
    console.error('addPost 오류:', error);
    throw error;
  }
}

export async function updatePost(
  id: number,
  title: string,
  content: string
): Promise<BoardPost | null> {
  try {
    const { data, error } = await supabase
      .from('board_posts')
      .update({
        title: title.trim(),
        content: content.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('게시글 수정 오류:', error);
      return null;
    }

    return data ? mapDBPostToPost(data) : null;
  } catch (error) {
    console.error('updatePost 오류:', error);
    return null;
  }
}

export async function deletePost(id: number): Promise<boolean> {
  try {
    const { error } = await supabase.from('board_posts').delete().eq('id', id);

    if (error) {
      console.error('게시글 삭제 오류:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('deletePost 오류:', error);
    return false;
  }
}

export async function toggleLike(
  id: number,
  userId: string
): Promise<{ post: BoardPost | null; isLiked: boolean }> {
  console.log('=== toggleLike 호출 ===');
  console.log('요청된 게시글 ID:', id, '타입:', typeof id);
  console.log('사용자 ID:', userId);

  try {
    // Supabase RPC 함수 호출
    const { data, error } = await supabase.rpc('toggle_board_post_like', {
      post_id: id,
      user_id: userId,
    });

    if (error) {
      console.error('좋아요 토글 오류:', error);
      return { post: null, isLiked: false };
    }

    console.log('RPC 응답:', data);

    // 업데이트된 게시글 조회
    const post = await getPostById(id);

    if (!post) {
      console.error('❌ 게시글을 찾을 수 없음!');
      return { post: null, isLiked: false };
    }

    // data는 배열로 반환되므로 첫 번째 요소 사용
    const result = Array.isArray(data) ? data[0] : data;
    const isLiked = result?.is_liked ?? false;

    console.log('✅ 좋아요 토글 완료 - 현재 좋아요 수:', post.likeCount);
    return { post, isLiked };
  } catch (error) {
    console.error('toggleLike 오류:', error);
    return { post: null, isLiked: false };
  }
}

export async function isLikedByUser(id: number, userId: string): Promise<boolean> {
  try {
    const post = await getPostById(id);
    if (!post) {
      return false;
    }
    return post.likedBy.includes(userId);
  } catch (error) {
    console.error('isLikedByUser 오류:', error);
    return false;
  }
}

export async function clearAllPosts(): Promise<boolean> {
  try {
    const { error } = await supabase.from('board_posts').delete().neq('id', 0);

    if (error) {
      console.error('게시글 전체 삭제 오류:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('clearAllPosts 오류:', error);
    return false;
  }
}
