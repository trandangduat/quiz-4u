import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  const { quizId, quizDuration, quizStartTime } = await req.json();

  if (!session) {
    return NextResponse.json({
      error: "Unauthorized"
    }, {
      status: 401
    });
  }

  try {
    const attempt = await prisma.attempt.create({
      data: {
        userId: session?.user?.id!,
        quizId: quizId,
        quizDuration: quizDuration,
        quizStartTime: quizStartTime,
        userChoices: {},
        correctedAnswers: -1,
      }
    });

    return NextResponse.json(attempt);

  } catch(e) {
    return NextResponse.json({
      error: "Error creating quiz attempt"
    }, {
      status: 500
    });
  }
}