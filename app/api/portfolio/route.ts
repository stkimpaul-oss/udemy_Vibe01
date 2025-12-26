import { NextResponse } from "next/server";
import { portfolioInfo } from "@/lib/data";

// GET /api/portfolio - 포트폴리오 기본 정보 반환
export async function GET() {
  try {
    return NextResponse.json(
      {
        success: true,
        data: portfolioInfo,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "포트폴리오 정보를 가져오는 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}

