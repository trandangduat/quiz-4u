import dayjs from "dayjs"; import { ArrowUpRight, ChartScatter,Clock, Layers2, List, LoaderCircle, Pin, TrendingUp } from "lucide-react";
import Link from "next/link";
import relativeTime from "dayjs/plugin/relativeTime";
import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction, useState } from "react";
dayjs.extend(relativeTime);

export default function QuizCard({ quizLink, quizInfo, chosenQuiz, setChosenQuiz } : {
    quizLink: string,
    quizInfo: {
        id: string,
        title: string,
        questionCount: number,
        createdAt?: Date,
        attemptsCount: number,
        avgScore: number,
        maxScore: number
    },
    chosenQuiz: string | null,
    setChosenQuiz: Dispatch<SetStateAction<string | null>>
}) {
    const quizInfoStyle = "flex items-center font-semibold justify-between w-full";
    const [loading, setLoading] = useState<boolean>(false);

    return (
        <div
            className={cn(
                "group bg-card/50 dark:bg-secondary/25 rounded-md p-6 h-full relative transition-opacity duration-1000",
                chosenQuiz && chosenQuiz !== quizInfo.id && "opacity-25 pointer-events-none"
            )}
        >
            <div className="relative h-full">
                <div className="flex flex-col items-start gap-4 justify-between h-full">
                    <div className="w-full">
                        <p className="font-bold text-xl tracking-tight w-full">
                            {quizInfo?.title || 'Unnamed'}
                        </p>
                    </div>
                    <div className="flex flex-col flex-wrap gap-2 w-full text-sm">
                        <div className={quizInfoStyle}>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <List size={14} />
                                <span>Questions</span>
                            </div>
                            <span>{quizInfo?.questionCount || 0}</span>
                        </div>
                        <div className={quizInfoStyle}>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Clock size={14} />
                                <span>Created</span>
                            </div>
                            <span>{dayjs(quizInfo?.createdAt).fromNow()}</span>
                        </div>
                        <div className={quizInfoStyle}>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Layers2 size={14} />
                                <span>Attempts</span>
                            </div>
                            <span>{quizInfo.attemptsCount}</span>
                        </div>
                        <div className={quizInfoStyle}>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <ChartScatter size={14} />
                                <span>Average score</span>
                            </div>
                            <span>{quizInfo.avgScore.toFixed(1)}</span>
                        </div>
                        <div className={quizInfoStyle}>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <TrendingUp size={14} />
                                <span>Maximum score</span>
                            </div>
                            <span>{quizInfo.maxScore}</span>
                        </div>
                    </div>
                    <div className="flex flex-row w-full text-base gap-4 font-semibold">
                        <button className="p-3 rounded-md bg-secondary/25 flex items-center justify-center gap-2 cursor-pointer w-full hover:bg-secondary/75 text-primary">
                            <Pin size={16} />
                            <span>Pin</span>
                        </button>
                        <Link 
                            href={quizLink} 
                            className="w-full" 
                            onClick={() => { 
                                setLoading(true);
                                setChosenQuiz(quizInfo.id);
                            }}
                        >
                            <button className="p-3 rounded-md bg-secondary/25 flex items-center justify-center gap-2 cursor-pointer w-full hover:bg-secondary/75 text-primary">
                                {loading ? (<>
                                    <LoaderCircle size={16} className="animate-spin"/>
                                    <span>Redirecting...</span>
                                </>) : (<>
                                    <ArrowUpRight size={16} />
                                    <span>View</span>
                                </>)}
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
