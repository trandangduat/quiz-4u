import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import QuizForm from "../components/quiz-form";

async function Quiz({ params } : { params: Promise<{ quizId: string }> }) {
    const { quizId } = await params;
    const quiz = await prisma.quiz.findUnique({
        where: {
            id: quizId,
        },
        include: {
            questions: {
                select: {
                    question: true,
                    choices: true,
                    id: true,
                }
            },
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
        <QuizForm quiz={quiz} />
    )
}

export default async function Page({ params } : { params: Promise<{ quizId: string }> }) {
    return (
        <>
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Quiz params={params} />
            </div>
        </>
    )
}