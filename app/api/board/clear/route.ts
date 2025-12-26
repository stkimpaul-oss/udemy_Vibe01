import { NextResponse } from "next/server";
import { clearAllPosts } from "@/lib/board";

// DELETE /api/board/clear - 모든 게시글 초기화
export async function DELETE() {
  try {
    clearAllPosts();
    return NextResponse.json(
      {
        success: true,
        message: "모든 게시글이 초기화되었습니다.",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "게시글 초기화 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}

