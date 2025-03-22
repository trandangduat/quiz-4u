import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma"
import Link from "next/link";
import { Suspense } from "react";
import CardSkeleton from "./loading";

function QuizCard({ name, questionsCount, id } 
    : { 
        name: string, 
        questionsCount: number
        id: string
    }
) {
    return (
        <div className="p-4 border-amber-100 border-1 m-4">
            <Link href={`/quiz/${id}`} className="text-blue-400 text-xl hover:text-blue-600">
                <h1 className="font-bold">{name}</h1>
            </Link>
            <p>Questions: {questionsCount}</p>
        </div>
    )
}

async function Quizzes() {
    const session = await auth();
    if (!session?.user) {
        return (
            <h1>You need to be signed in to access this page.</h1>
        );
    }

    const createdQuizzes = await prisma.quiz.findMany({
        where: {
            creatorId: session?.user?.id
        },
        include: {
            questions: true
        }
    });

    return (
        <>
            {createdQuizzes.map(Q => 
                <QuizCard 
                    key={Q.id} 
                    name={Q.title}
                    questionsCount={Q.questions.length}
                    id={Q.id}
                />
            )}
        </>
    )
}

export default async function Page() {

    return (
        <>
            <Suspense fallback={<CardSkeleton />}>
                <Quizzes />
            </Suspense>
        </>
    )
}