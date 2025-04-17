import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { attemptId, userChoices } = await req.json();

  try {
    const attempt = await prisma.attempt.update({
      where: {
        id: attemptId,
      },
      data: {
        userChoices: userChoices,
      }
    });

    return NextResponse.json(attempt);

  } catch(e) {
    return NextResponse.json({
      error: "Error updating quiz attempt"
    }, {
      status: 500
    });
  }
}