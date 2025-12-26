import { NextResponse } from "next/server";
import { clearAllEntries } from "@/lib/guestbook";

// DELETE /api/guestbook/clear - 모든 방명록 초기화
export async function DELETE() {
  try {
    clearAllEntries();
    return NextResponse.json(
      {
        success: true,
        message: "모든 방명록이 초기화되었습니다.",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "방명록 초기화 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}

