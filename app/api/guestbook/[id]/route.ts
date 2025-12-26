import { NextRequest, NextResponse } from "next/server";
import { getEntryById, updateEntry, deleteEntry } from "@/lib/guestbook";

// PUT /api/guestbook/[id] - 방명록 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const entryId = parseInt(id);

    if (isNaN(entryId)) {
      return NextResponse.json(
        {
          success: false,
          error: "유효하지 않은 방명록 ID입니다.",
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, message } = body;

    // 유효성 검사
    if (!name || !message) {
      return NextResponse.json(
        {
          success: false,
          error: "이름과 메시지를 모두 입력해주세요.",
        },
        { status: 400 }
      );
    }

    if (name.trim().length === 0 || message.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "이름과 메시지는 공백일 수 없습니다.",
        },
        { status: 400 }
      );
    }

    if (name.length > 50) {
      return NextResponse.json(
        {
          success: false,
          error: "이름은 50자 이하여야 합니다.",
        },
        { status: 400 }
      );
    }

    if (message.length > 500) {
      return NextResponse.json(
        {
          success: false,
          error: "메시지는 500자 이하여야 합니다.",
        },
        { status: 400 }
      );
    }

    const entry = updateEntry(entryId, name, message);

    if (!entry) {
      return NextResponse.json(
        {
          success: false,
          error: "방명록을 찾을 수 없습니다.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: entry,
        message: "방명록이 성공적으로 수정되었습니다.",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "방명록 수정 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/guestbook/[id] - 방명록 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const entryId = parseInt(id);

    if (isNaN(entryId)) {
      return NextResponse.json(
        {
          success: false,
          error: "유효하지 않은 방명록 ID입니다.",
        },
        { status: 400 }
      );
    }

    const deleted = deleteEntry(entryId);

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: "방명록을 찾을 수 없습니다.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "방명록이 성공적으로 삭제되었습니다.",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "방명록 삭제 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}

