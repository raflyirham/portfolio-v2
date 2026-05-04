import { NextResponse } from "next/server";

import { getPublishedProjects } from "@/libs/projects";

export async function GET() {
  try {
    const data = await getPublishedProjects();

    return NextResponse.json({
      code: 200,
      status: "success",
      data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        code: 500,
        status: "error",
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
