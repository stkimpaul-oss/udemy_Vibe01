import { NextResponse } from "next/server";
import { projects } from "@/lib/data";

// GET /api/projects/[id] - 특정 프로젝트 상세 정보 반환
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const projectId = parseInt(id);

    if (isNaN(projectId)) {
      return NextResponse.json(
        {
          success: false,
          error: "유효하지 않은 프로젝트 ID입니다.",
        },
        { status: 400 }
      );
    }

    const project = projects.find((p) => p.id === projectId);

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          error: "프로젝트를 찾을 수 없습니다.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: project,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "프로젝트 정보를 가져오는 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}

