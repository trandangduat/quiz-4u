import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Suspense } from "react";
import QuizForm from "../components/quiz-form";

async function Quiz({ params } : { params: Promise<{ quizId: string }> }) {
    const { quizId } = await params;
    const quiz = await prisma.quiz.findUnique({
        where: {
            id: quizId,
        },
        include: {
            questions: true,
            creator: true
        }
    });

    const session = await auth();
    if (session?.user?.id != quiz?.creatorId) {
        return (
            <>
                <h1>This page is not public or not available.</h1>
            </>
        )
    }

    return (
        <>
            <h1>{quiz?.title}</h1>
            <QuizForm quiz={quiz} />
        </>
    )
}

function QuizSkeleton() {
    return (
        <>
            <h1>Loading...</h1>
        </>
    )
}

export default async function Page({ params } : { params: Promise<{ quizId: string }> }) {
    return (
        <>
            <Suspense fallback={<QuizSkeleton />}>
                <Quiz params={params} />
            </Suspense>
        </>
    )
}