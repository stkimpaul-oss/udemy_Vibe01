import { NextRequest, NextResponse } from "next/server";
import { getPostById, updatePost, deletePost } from "@/lib/board";

// PUT /api/board/[id] - 게시글 수정
export async function PUT(
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

    const post = updatePost(postId, title, content);

    if (!post) {
      return NextResponse.json(
        {
          success: false,
          error: "게시글을 찾을 수 없습니다.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: post,
        message: "게시글이 성공적으로 수정되었습니다.",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "게시글 수정 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/board/[id] - 게시글 삭제
export async function DELETE(
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

    const deleted = deletePost(postId);

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: "게시글을 찾을 수 없습니다.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "게시글이 성공적으로 삭제되었습니다.",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "게시글 삭제 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}

