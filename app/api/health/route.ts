import { NextResponse } from "next/server";

// GET /api/health - API 상태 확인
export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      message: "API is running",
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}

