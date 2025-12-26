import { NextRequest, NextResponse } from "next/server";
import { getAllEntries, addEntry } from "@/lib/guestbook";

// GET /api/guestbook - 모든 방명록 조회
export async function GET() {
  try {
    const entries = getAllEntries();
    return NextResponse.json(
      {
        success: true,
        data: entries,
        count: entries.length,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "방명록을 가져오는 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}

// POST /api/guestbook - 방명록 작성
export async function POST(request: NextRequest) {
  try {
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

    const entry = addEntry(name, message);

    return NextResponse.json(
      {
        success: true,
        data: entry,
        message: "방명록이 성공적으로 작성되었습니다.",
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "방명록 작성 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}

