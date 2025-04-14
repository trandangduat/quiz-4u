import QuizConfigForm from "@/components/quiz-config-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ArrowBigRight, ArrowRight, Clock, List, User } from "lucide-react";

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
                <div className="flex justify-between p-6 bg-card dark:bg-secondary/25 rounded-md mt-6">
                    <h2>Your previous attempts</h2>
                </div>
            </div>
        </>
    )
}