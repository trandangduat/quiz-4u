"use client";

import { ClockAlert } from "lucide-react";
import { useCurrentAttempt } from "./providers/current-attempt";
import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useParams, usePathname } from "next/navigation";

export default function CurrentAttemptToast() {
    const {
        quiz,
        startTimeUTC,
        quizDuration,
        userChoices
    } = useCurrentAttempt();
    const [minutes, setMinutes] = useState<number>(-1);
    const [seconds, setSeconds] = useState<number>(-1);
    const answeredCount = Object.keys(userChoices).filter(key => userChoices[key] !== undefined).length;
    const pathname = usePathname();

    useEffect(() => {
        if (startTimeUTC < 0 || quizDuration < 0) {
            return;
        }
        const setTime = () => {
            const elapsed = Math.max(0, Date.now() - startTimeUTC);
            const remaining = Math.max(0, quizDuration - elapsed);
            setMinutes(Math.floor((remaining / 1000 / 60)));
            setSeconds(Math.floor((remaining / 1000) % 60));
        };
        setTime();
        const interval = setInterval(setTime, 500);

        return () => clearInterval(interval)
    }, [startTimeUTC, quizDuration]);

    if (!quiz || !quiz.id || startTimeUTC < 0 || pathname === `/quiz/${quiz.id}/attempt`) {
        return null;
    }

    return (
        <Link href={`/quiz/${quiz?.id}/attempt`}>
            <div className="fixed bottom-6 right-6 w-full max-w-md mx-auto z-50 animate-[slide-in-bottom_250ms]">
                <div className={cn(
                    "bg-primary rounded-md p-6 h-full relative",
                    "hover:scale-103 transition-all duration-200",
                    "active:scale-100",
                )}>
                    <div className="flex flex-row justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="text-background">
                                <ClockAlert size={48} />
                            </div>
                            <div className="flex flex-col items-start">
                                <div className="overflow-x-clip text-ellipsis text-background whitespace-nowrap max-w-[210px]">
                                    <span className="font-bold text-lg w-full">
                                        {quiz?.title}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-2 font-medium">
                                    <div className="inline-block text-sm text-background">
                                        <span>{answeredCount}/{quiz?.questionsCount} answered</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center text-background font-mono">
                            {minutes < 0 && seconds < 0 ? (
                                <span className="text-4xl font-bold">&#8734;</span>
                            ) : (
                                <>
                                    <span className="text-4xl font-bold">{minutes > 9 ? minutes : `0${minutes}` }</span>
                                    <span className="text-3xl font-bold">:</span>
                                    <span className="text-4xl font-bold">{seconds > 9 ? seconds : `0${seconds}`}</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}