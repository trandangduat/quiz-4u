import { prisma } from "@/lib/prisma";
import { QuizQuestion } from "@/types/quiz";
import { randomUUID } from "crypto";
import { Suspense } from "react";

function Question ({ Q } : { Q: QuizQuestion }) {
    return (
        <div>
            <p className="font-bold">{Q.question}</p>
            {Q.choices.map(choice => (
                <div key={randomUUID()}>
                    <p>{choice}</p>
                </div>
            ))}
        </div>
    );
}

async function Quiz({ params } : { params: Promise<{ quizId: string }> }) {
    const { quizId } = await params;
    const quiz = await prisma.quiz.findUnique({
        where: {
            id: quizId,
        },
        include: {
            questions: true,
        }
    });

    return (
        <>
            <h1>{quiz?.title}</h1>
            <div className="flex flex-col gap-8">
                {quiz?.questions.map(Q => (
                    <Question Q={Q} key={Q.id} />
                ))}
            </div>
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

export default function Page({ params } : { params: Promise<{ quizId: string }> }) {

    return (
        <>
            <h1>Hello quiz</h1>
            <Suspense fallback={<QuizSkeleton />}>
                <Quiz params={params} />
            </Suspense>
        </>
    )
}