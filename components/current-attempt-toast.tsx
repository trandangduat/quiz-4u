"use client";

import { ClockAlert } from "lucide-react";
import { useCurrentAttempt } from "./providers/current-attempt";
import { useEffect, useState } from "react";

export default function CurrentAttemptToast() {
    const {
        quiz,
        startTimeUTC,
        quizDuration,
        userChoices
    } = useCurrentAttempt();
    const [minutes, setMinutes] = useState<number>(-1);
    const [seconds, setSeconds] = useState<number>(-1);
    const answeredCount = Object.keys(userChoices).length;

    useEffect(() => {
        if (startTimeUTC < 0 || quizDuration < 0) {
            return;
        }
        const interval = setInterval(() => {
            const elapsed = Math.max(0, Date.now() - startTimeUTC);
            const remaining = Math.max(0, quizDuration - elapsed);
            setMinutes(Math.floor((remaining / 1000 / 60)));
            setSeconds(Math.floor((remaining / 1000) % 60));
        }, 500);
        return () => clearInterval(interval)
    }, [startTimeUTC, quizDuration]);

    // if (!quizId) {
    //     return null;
    // }

    return (
        <div className="fixed bottom-6 right-6 w-full max-w-md mx-auto z-50">
            <div className="bg-linear-to-r from-primary to-secondary-500 rounded-md p-6 h-full relative">
                <div className="flex flex-row justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="text-background">
                            <ClockAlert size={48} />
                        </div>
                        <div className="flex flex-col items-start">
                            <div>
                                <span className="font-bold text-lg text-background">
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
                    <div className="flex items-center gap-1 text-background">
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
    );
}