import { NextResponse } from "next/server";
import { projects } from "@/lib/data";

// GET /api/projects - 모든 프로젝트 목록 반환
export async function GET() {
  try {
    return NextResponse.json(
      {
        success: true,
        data: projects,
        count: projects.length,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "프로젝트 목록을 가져오는 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}

