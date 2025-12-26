import { NextRequest, NextResponse } from "next/server";
import { toggleLike } from "@/lib/board";

// POST /api/board/[id]/like - 게시글 좋아요 토글
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const postId = parseInt(id);

    if (isNaN(postId)) {
      return NextResponse.json(
        {
          success: false,
          error: "유효하지 않은 게시글 ID입니다.",
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "사용자 ID가 필요합니다.",
        },
        { status: 400 }
      );
    }

    // 디버깅을 위한 로그
    console.log("=== 좋아요 API 호출 ===");
    console.log("요청된 postId:", postId, "타입:", typeof postId);
    console.log("userId:", userId);
    
    // 먼저 게시글이 존재하는지 확인
    const { getAllPosts } = await import("@/lib/board");
    const allPosts = getAllPosts();
    console.log("현재 서버의 게시글 수:", allPosts.length);
    console.log("게시글 ID 목록:", allPosts.map(p => p.id));
    
    const { post, isLiked } = toggleLike(postId, userId);

    if (!post) {
      console.error("❌ 게시글을 찾을 수 없음!");
      console.error("요청된 postId:", postId);
      console.error("서버의 게시글 ID 목록:", allPosts.map(p => p.id));
      return NextResponse.json(
        {
          success: false,
          error: `게시글을 찾을 수 없습니다. (ID: ${postId}). 현재 게시글 수: ${allPosts.length}`,
        },
        { status: 404 }
      );
    }
    
    console.log("✅ 좋아요 처리 성공 - postId:", postId, "isLiked:", isLiked, "likeCount:", post.likeCount);

    return NextResponse.json(
      {
        success: true,
        data: post,
        isLiked,
        message: isLiked ? "좋아요가 추가되었습니다." : "좋아요가 취소되었습니다.",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "좋아요 처리 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}

