import QuizConfigForm from "@/components/quiz-config-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ArrowBigRight, ArrowRight, ArrowUpRight, Clock, Clock1, List, MoveUpRight, SquareArrowUpRight, Timer, User } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
dayjs.extend(relativeTime);

export default async function Page({ params } : { params: Promise<{ quizId: string }> }) {
    const { quizId } = await params;

    const quiz = await prisma.quiz.findUnique({
        where: {
            id: quizId,
        },
        include: {
            creator: true,
            questions: true
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

    const attempts = await prisma.attempt.findMany({
        where: {
            quizId: quizId,
            userId: session?.user?.id,
            isSubmitted: true
        },
        select: {
            id: true,
            correctedAnswers: true,
            quizStartTime: true,
        },
        orderBy: {
            quizStartTime: 'desc',
        }
    });

    console.log(attempts);

    return (
        <>
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center p-6 bg-card dark:bg-secondary/25 rounded-md">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-2xl font-bold">{quiz?.title}</h1>
                        <div className="flex flex-row gap-4">
                            <span className="flex items-center gap-2 text-sm">
                                <Clock size={16} />
                                {quiz?.createdAt.toDateString()}
                            </span>
                            <span className="flex items-center gap-2 text-sm">
                                <User size={16} />
                                {quiz?.creator?.name}
                            </span>
                            <span className="flex items-center gap-2 text-sm">
                                <List size={16} />
                                {quiz?.questions.length} questions
                            </span>
                        </div>
                    </div>
                    <Dialog>
                        <DialogTrigger>
                            <Button className="flex gap-2 items-center font-semibold p-4 cursor-pointer">
                                <ArrowRight size={16} />
                                Start Quiz
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader
                                title="Quiz configuration"
                                description="Configure your quiz as you like before starting."
                            />
                            <QuizConfigForm
                                quizId={quizId}
                                quizTitle={quiz?.title!}
                                questionsCount={quiz?.questions.length!}
                            />
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="p-6 bg-card dark:bg-secondary/25 rounded-md mt-6">
                    <h2>Your previous attempts</h2>
                    <div className="bg-secondary/15 px-4 rounded-md flex flex-col m-4 divide-y-1 divide-secondary/25">
                        {attempts.map(attempt => (
                            <div
                                key={attempt.id}
                                className="py-4"
                            >
                                <div className="flex flex-row w-full justify-between items-center">
                                    <div className="flex flex-row items-center gap-1 flex-1">
                                        <Timer size={16} />
                                        <span className="text-sm">
                                            {dayjs(attempt.quizStartTime).fromNow()}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <span className="font-bold text-xl">
                                            {attempt.correctedAnswers} / {quiz?.questions.length}
                                        </span>
                                    </div>
                                    <div>
                                        <Button
                                            variant="link"
                                            className="flex gap-2 items-center font-semibold p-4 cursor-pointer"
                                            asChild
                                        >
                                            <Link href={`/quiz/${quizId}/attempt/${attempt.id}`}>
                                                <ArrowUpRight size={16} />
                                                Details
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}