import QuizConfigForm from "@/components/quiz-config-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ArrowBigRight, ArrowRight, ArrowUpRight, BarChart, Clock, Clock1, History, List, LucideIcon, MoveUpRight, SquareArrowUpRight, SquareMousePointer, SquarePen, Timer, TrendingUp, User } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import AttemptsScoreChart from "@/components/attempts-score-chart";
import { Attempt } from "@prisma/client";
dayjs.extend(relativeTime);

export default async function Page({ params } : { params: Promise<{ quizId: string }> }) {
    const { quizId } = await params;

    const quiz = await prisma.quiz.findUnique({
        where: {
            id: quizId,
        },
        include: {
            creator: true,
            questions: true,
            knowledge: true
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

    const quizInfoStyle = "flex items-center gap-2 text-[13px] px-3 py-1 bg-secondary/70 rounded-full font-semibold text-primary-700 font-[var(--font-geist-mono)]";
    const chartData: {
        attemptId: number,
        score: number,
    }[] = [];

    let count:number = 1;
    for (let i = attempts.length - 1; i >= 0; i--) {
        chartData.push({
            attemptId: count++,
            score: attempts[i].correctedAnswers
        });
    }

    return (
        <>
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex lg:flex-row flex-col gap-6 items-start">
                <div className="flex flex-col justify-between p-6 bg-card dark:bg-secondary/25 rounded-md w-full basis-[45%] gap-6 self-start">
                    <div className="flex flex-col gap-4">
                        <h1 className="text-3xl font-bold tracking-tight">{quiz?.title}</h1>
                        <div className="flex flex-row gap-3">
                            <span className={quizInfoStyle}>
                                <Clock size={16} />
                                {quiz?.createdAt.toDateString()}
                            </span>
                            <span className={quizInfoStyle}>
                                <User size={16} />
                                {quiz?.creator?.name}
                            </span>
                            <span className={quizInfoStyle}>
                                <List size={16} />
                                {quiz?.questions.length} questions
                            </span>
                        </div>
                    </div>
                    <div className="bg-secondary/30 py-6 px-8 rounded-md">
                        <div className="mb-10 flex justify-center">
                            <h1 className="text-secondary-700 font-bold tracking-tight flex gap-2">
                                <TrendingUp />
                                Score Progress
                            </h1>
                        </div>
                        <AttemptsScoreChart chartData={chartData} />
                    </div>
                    <Dialog>
                        <DialogTrigger>
                            <Button className="font-semibold p-6 cursor-pointer text-base w-full">
                                <SquareMousePointer size={16} />
                                Start quiz
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
                <div className="p-6 bg-card dark:bg-secondary/25 rounded-md w-full flex-1">
                    <h2 className="flex items-center gap-2 text-xl font-semibold">
                        <History />
                        Attempts History
                    </h2>
                    <div className="flex flex-col m-4 divide-y-1 divide-secondary/25">
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
                                    <div className="flex-1 text-center">
                                        <span className="font-bold text-xl">
                                            {attempt.correctedAnswers} / {quiz?.questions.length}
                                        </span>
                                    </div>
                                    <div className="flex-1 flex justify-end">
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