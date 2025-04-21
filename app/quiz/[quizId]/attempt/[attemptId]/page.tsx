import QuizForm from "@/components/quiz-form";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function Page({ params } : { params: Promise<{ quizId: string, attemptId: string }> }) {
    const { quizId, attemptId } = await params;

    const session = await auth();
    if (!session?.user?.id) {
        return (
            <>
                <h1>This page is not public or not available.</h1>
            </>
        )
    }

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
                    answer: true,
                    explanation: true
                }
            },
            creator: true
        }
    });

    let attempt = null;

    try {
        attempt = await prisma.attempt.update({
            where: {
                id: attemptId,
            },
            data: {
                isSubmitted: true,
            }
        });
    } catch(e) {
        return (
            <>
                <h1>No attempt found with ID {attemptId}</h1>
            </>
        );
    }

    return (
        <>
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <QuizForm quiz={quiz} attempt={attempt} />
            </div>
        </>
    )
}