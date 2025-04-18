import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session) {
    return NextResponse.json({
      error: "Unauthorized"
    }, {
      status: 401
    });
  }

  try {
    const result = await prisma.$queryRaw`
      SELECT
        "Attempt".*,
        "Quiz"."title" AS "quizTitle",
        (SELECT COUNT(*) FROM "Question" WHERE "Question"."quizId" = "Quiz"."id")::INTEGER AS "questionsCount"
      FROM "Attempt"
      JOIN "Quiz" ON "Quiz"."id" = "Attempt"."quizId"
      WHERE "userId" = ${session?.user?.id}
        AND "isSubmitted" = FALSE
        AND "quizStartTime" + INTERVAL '1 millisecond' * "quizDuration" > NOW()
    `;

    return NextResponse.json(result);
  } catch(e) {
    console.log(e)
    return NextResponse.json({
      error: "Error fetching quiz attempts"
    }, {
      status: 500
    });
  }

}