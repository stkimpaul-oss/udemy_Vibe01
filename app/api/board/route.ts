import { NextRequest, NextResponse } from "next/server";
import { getAllPosts, addPost, getPostById } from "@/lib/board";

// GET /api/board - 모든 게시글 조회
export async function GET() {
  try {
    const posts = getAllPosts();
    console.log("게시글 목록 조회 - 총 개수:", posts.length);
    console.log("게시글 ID 목록:", posts.map(p => p.id));
    return NextResponse.json(
      {
        success: true,
        data: posts,
        count: posts.length,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "게시글을 가져오는 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}

// POST /api/board - 게시글 작성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content } = body;

    // 유효성 검사
    if (!title || !content) {
      return NextResponse.json(
        {
          success: false,
          error: "제목과 내용을 모두 입력해주세요.",
        },
        { status: 400 }
      );
    }

    if (title.trim().length === 0 || content.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "제목과 내용은 공백일 수 없습니다.",
        },
        { status: 400 }
      );
    }

    if (title.length > 100) {
      return NextResponse.json(
        {
          success: false,
          error: "제목은 100자 이하여야 합니다.",
        },
        { status: 400 }
      );
    }

    if (content.length > 2000) {
      return NextResponse.json(
        {
          success: false,
          error: "내용은 2000자 이하여야 합니다.",
        },
        { status: 400 }
      );
    }

    const post = addPost(title, content);
    
    // 디버깅: 게시글 작성 후 전체 목록 확인
    const allPosts = getAllPosts();
    console.log("게시글 작성 완료 - 새 게시글 ID:", post.id);
    console.log("현재 전체 게시글 수:", allPosts.length);
    console.log("전체 게시글 ID 목록:", allPosts.map(p => p.id));

    return NextResponse.json(
      {
        success: true,
        data: post,
        message: "게시글이 성공적으로 작성되었습니다.",
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "게시글 작성 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}

