import QuizForm from "@/components/quiz-form";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Attempt } from "@prisma/client";

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

    let attempt: (Attempt | null) = null;

    try {
        attempt = await prisma.attempt.findUniqueOrThrow({
            where: {
                id: attemptId,
            }
        });
        if (!attempt.isSubmitted) {
            let countCorrect: number = 0;
            for (const Q of quiz?.questions!) {
                if (Q.answer !== undefined) {
                    let userChoice: number = attempt.userChoices[Q.id];
                    countCorrect += (Q.answer === userChoice ? 1 : 0);
                }
            }
            attempt = await prisma.attempt.update({
                where: {
                    id: attemptId,
                },
                data: {
                    isSubmitted: true,
                    correctedAnswers: countCorrect
                }
            });
        }
    } catch(e) {
        return (
            <>
                <h1>No attempt found with ID {attemptId}</h1>
            </>
        );
    }

    return (
        <>
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <QuizForm quiz={quiz} attempt={attempt} />
            </div>
        </>
    )
}