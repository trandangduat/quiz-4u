"use client"

import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, ChevronLeft, ChevronRight, MessageCircleWarning, Send, X } from "lucide-react";
import { useCurrentAttempt } from "@/components/providers/current-attempt";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import remarkMath from "remark-math";
import Markdown from "react-markdown";
import rehypeKatex from "rehype-katex";

function RadioButton({ isChosen, isCorrect, isGraded }: { isChosen: boolean, isCorrect: boolean, isGraded: boolean }) {
    return (
        <div
            className={cn(
                "w-4 h-4 rounded-full border-2 border-primary",
                isChosen && "bg-primary",
                isGraded && isChosen && isCorrect && "bg-green-700 border-green-700 dark:bg-green-300 dark:border-green-300",
                isGraded && isChosen && !isCorrect && "bg-red-700 border-red-700 dark:bg-red-400 dark:border-red-400",
            )}
        >
        </div>
    );
}

function Choice({ content, index, questionId, isChosen, isCorrect, isGraded }:
    {
        content: string,
        index: number,
        questionId: number,
        isChosen: boolean,
        isCorrect: boolean,
        isGraded: boolean
    }
) {

    const { setUserChoices } = useCurrentAttempt();

    function updateUserAnswer() {
        if (isGraded) {
            return;
        }
        setUserChoices((prevChoices) => {
            return {
                ...prevChoices,
                [questionId]: index
            };
        });
    }

    return (
        <div
            className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-md border border-transparent",
                !isGraded && !isChosen && "hover:bg-secondary/50 cursor-pointer transition-all hover:border-secondary/30",
                isChosen && "bg-secondary/75 border-secondary/50",
                isChosen && isGraded && !isCorrect && "bg-red-500/20 border-red-200 dark:border-red-900/50",
                isGraded && isCorrect && "bg-green-300/30 border-green-200 dark:border-green-900/50",
            )}
            onClick={() => updateUserAnswer()}
            tabIndex={isGraded ? -1 : 0}
            role="radio"
            aria-checked={isChosen}
        >
            <RadioButton
                isChosen={isChosen}
                isCorrect={isCorrect}
                isGraded={isGraded}
            />
            <span className="font-[var(--font-inter)] text-sm tracking-wide">
                <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {content}
                </Markdown>
            </span>
        </div>
    );
}

function Question({ Q, answer, questionNumber, userChoice, isSubmitted }:
    {
        Q: any,
        answer: { index: number; explanation: string } | undefined,
        questionNumber: number,
        userChoice?: number | null,
        isSubmitted: boolean,
    }
) {

    const { setUserChoices } = useCurrentAttempt();

    return (
        <div
            id={`question-${Q.id}`}
            className={cn(
                "rounded-lg bg-white dark:bg-secondary/25 border border-border/40 shadow-sm",
                "transition-all duration-200 hover:shadow-md"
            )}
        >
            <div className="flex items-center justify-between gap-4 p-4 border-b dark:border-secondary/50">
                <div className="flex items-center gap-3">
                    <span className="bg-primary/15 text-primary font-medium rounded-full w-8 h-8 flex items-center justify-center shadow-sm">
                        {questionNumber}
                    </span>
                    <span className="font-[var(--font-geist-mono)]">
                        <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                            {Q.question}
                        </Markdown>
                    </span>
                </div>
                {!isSubmitted && (
                    <div className="">
                        <Button
                            variant="soft"
                            className="p-2 rounded-full hover:bg-secondary/70 transition-colors"
                            onClick={() => setUserChoices((prevChoices) => ({ ...prevChoices, [Q.id]: undefined }))}
                            aria-label="Reset answer"
                            disabled={userChoice === undefined || answer !== undefined}
                        >
                            <X size={16} className="mr-1" />
                            <span className="text-sm">Reset</span>
                        </Button>
                    </div>
                )}
                {answer && (
                    <div className={cn(
                        "flex items-center gap-2 mb-1 font-medium px-3 py-1 rounded-full",
                        answer.index === userChoice
                            ? "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20"
                            : "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20"
                    )}>
                        {answer.index === userChoice ? (
                            <><Check size={18} />Correct</>
                        ) : (
                            <><X size={18} />Incorrect</>
                        )}
                    </div>
                )}
            </div>
            <div className="flex flex-col gap-2 p-5">
                {Q.choices.map((choice: string, index: number) => (
                    <Choice
                        key={choice}
                        questionId={Q.id}
                        content={choice}
                        index={index}
                        isChosen={userChoice === index}
                        isCorrect={answer?.index === index}
                        isGraded={answer !== undefined}
                    />
                ))}

                {answer && (
                    <div className="mt-2 italic text-sm bg-secondary/25 p-4 rounded-md flex items-center gap-4">
                        <div className="bg-primary/10 rounded-full p-2 text-primary">
                            <MessageCircleWarning size={28} strokeWidth={1.5} />
                        </div>
                        <span className="leading-relaxed">
                            <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                                {answer.explanation}
                            </Markdown>
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

function Clock() {
    const { minutes, seconds } = useCurrentAttempt();

    return (
        <div className="flex items-center gap-2 justify-center">
            <div className="flex items-center gap-1 font-mono">
                {minutes < 0 && seconds < 0 ? (
                    <span className="text-4xl font-bold">&#8734;</span>
                ) : (
                    <>
                        <span className="text-4xl font-bold">{minutes > 9 ? minutes : `0${minutes}`}</span>
                        <span className="text-3xl font-bold text-secondary-700">:</span>
                        <span className="text-4xl font-bold">{seconds > 9 ? seconds : `0${seconds}`}</span>
                    </>
                )}
            </div>
        </div>
    );
}

export default function QuizForm({ quiz, attempt }: { quiz: any, attempt?: any }) {
    const answers: Record<string, { index: number, explanation: string }> = {};
    const isSubmitted: boolean = attempt?.isSubmitted || false;
    const router = useRouter();
    const currentAttempt = useCurrentAttempt();
    const userChoices: Record<string, number> = (isSubmitted ? attempt.userChoices : currentAttempt.userChoices);
    const totalQuestions = quiz?.questions?.length || 0;
    const answeredQuestions = Object.keys(userChoices).filter(key => userChoices[key] !== undefined).length;
    let score: number = 0;
    const pathname = usePathname();

    if (isSubmitted) {
        for (const Q of quiz?.questions) {
            if (Q.answer !== undefined) {
                answers[Q.id] = {
                    index: Q.answer,
                    explanation: Q.explanation
                };
                score += (Q.answer === userChoices[Q.id] ? 1 : 0);
            }
        }
    }

    const handleSubmitQuizAttempt = () => {
        router.push(`${pathname}/${currentAttempt.attemptId}`);
        currentAttempt.reset();
    };

    const scrollToQuestion = (questionId: string) => {
        const element = document.body.querySelector(`#question-${questionId}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="flex flex-col md:flex-row gap-6 relative">
            <div className="flex-1">
                <div className="mb-10">
                    <h1 className="text-3xl font-bold">{quiz.title}</h1>
                </div>

                <div className="flex flex-col gap-8">
                    {quiz?.questions.map((Q: any, index: number) => (
                        <Question
                            Q={Q}
                            key={Q.id}
                            answer={answers[Q.id]}
                            questionNumber={index + 1}
                            userChoice={userChoices[Q.id]}
                            isSubmitted={isSubmitted}
                        />
                    ))}

                </div>
            </div>

            {/* Fixed Questions Tracker Sidebar */}
            <div className="md:block w-56 sticky top-24 h-fit self-start">
                <div className="bg-card dark:bg-secondary/30 backdrop-blur-sm p-4 rounded-lg shadow-sm">
                    <h3 className="font-medium mb-3 text-sm">Questions</h3>
                    <div className="grid grid-cols-4 gap-2 mb-4">
                        {quiz?.questions.map((Q: any, index: number) => {
                            const isAnswered = userChoices[Q.id] !== undefined;
                            const isCorrect = answers[Q.id] !== undefined && answers[Q.id].index === userChoices[Q.id];
                            const isIncorrect = answers[Q.id] !== undefined && answers[Q.id].index !== userChoices[Q.id];

                            return (
                                <button
                                    key={Q.id}
                                    onClick={() => scrollToQuestion(Q.id)}
                                    className={cn(
                                        "w-9 h-9 rounded flex items-center justify-center text-sm font-medium transition-all cursor-pointer",
                                        isAnswered && !isSubmitted && "bg-primary text-background",
                                        !isAnswered && "bg-secondary/50",
                                        isCorrect && "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
                                        isIncorrect && "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300",
                                    )}
                                    aria-label={`Go to question ${index + 1}`}
                                >
                                    {index + 1}
                                </button>
                            );
                        })}
                    </div>

                    {/* Progress summary in sidebar */}
                    <div className="text-sm">
                        <div className="flex justify-between mb-1">
                            <span className="text-muted-foreground">Answered:</span>
                            <span className="font-medium">{answeredQuestions}/{totalQuestions}</span>
                        </div>
                    </div>
                </div>
                {isSubmitted && (
                    <div className="bg-card dark:bg-secondary/30 backdrop-blur-sm p-4 rounded-lg shadow-sm mt-4">
                        <h3 className="font-medium mb-3 text-sm">Score</h3>
                        <div className="flex flex-col items-center justify-center">
                            <div className="relative w-32 h-32 flex items-center justify-center mb-2">
                                <svg className="w-full h-full" viewBox="0 0 36 36">
                                    <circle
                                        cx="18"
                                        cy="18"
                                        r="15.91549430918954"
                                        fill="transparent"
                                        stroke="#e6e6e6"
                                        strokeWidth="2"
                                        className="dark:stroke-secondary/50"
                                    />

                                    <circle
                                        cx="18"
                                        cy="18"
                                        r="15.91549430918954"
                                        fill="transparent"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeDasharray={`${(score / quiz?.questions.length) * 100} 100`}
                                        strokeDashoffset="25"
                                        className="text-primary transition-all duration-1000 ease-in-out"
                                    />
                                </svg>
                                {/* Score text */}
                                <div className="absolute flex items-center justify-center">
                                    <span className="text-3xl font-bold">{score}/{quiz?.questions.length}</span>
                                </div>
                            </div>
                            <div className="text-center">
                                <span className="text-lg font-medium text-primary">
                                    {Math.round((score / quiz?.questions.length) * 100)}%
                                </span>
                            </div>
                        </div>
                    </div>
                )}
                {!isSubmitted && (
                    <div className="bg-card dark:bg-secondary/30 backdrop-blur-sm p-4 rounded-lg shadow-sm mt-4">
                        <h3 className="font-medium mb-3 text-sm">Time remaining</h3>
                        <Clock />
                    </div>
                )}
                <div className="flex items-center justify-center mt-4">
                    {!isSubmitted ? (
                        <Button
                            className="p-6 w-full font-bold text-md cursor-pointer"
                            onClick={handleSubmitQuizAttempt}
                            disabled={answeredQuestions === 0}
                        >
                            <Send size={16} />
                            Submit
                        </Button>
                    ) : (
                        <Button
                            variant="soft"
                            className="p-6 w-full"
                        >
                            <ArrowLeft size={16} />
                            <Link href={`/quiz/${quiz.id}`}>
                                Go back to quiz
                            </Link>
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}