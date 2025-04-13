"use client"

import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import gradeUserChoices from "../[quizId]/action";
import { Button } from "@/components/ui/button";
import { Check, ChevronLeft, ChevronRight, X } from "lucide-react";

function RadioButton({ isChosen, isCorrect, isGraded } : { isChosen: boolean, isCorrect: boolean, isGraded: boolean }) {
    return (
        <div
            className={cn(
                "w-4 h-4 rounded-full border-2 border-primary",
                isChosen && "bg-primary",
                isChosen && isGraded && !isCorrect && "bg-red-700 border-red-700",
                isGraded && isCorrect && "bg-green-700 border-green-700",
            )}
        >
        </div>
    );
}

function Choice({ content, index, questionId, isChosen, isCorrect, isGraded, setUserChoices } :
    {
        content: string,
        index: number,
        questionId: number,
        isChosen: boolean,
        isCorrect: boolean,
        isGraded: boolean,
        setUserChoices: Dispatch<SetStateAction<Record<string, number>>>
    }
) {

    function updateUserAnswer() {
        if (isGraded) {
            return;
        }
        setUserChoices(prevChoices => {
            return { ...prevChoices, [questionId]: index };
        });
    }

    return (
        <div
            className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-md ",
                !isGraded && !isChosen && "hover:bg-secondary/35 cursor-pointer transition-colors",
                isChosen && "bg-secondary/75",
                isChosen && isGraded && !isCorrect && "bg-red-500/20",
                isGraded && isCorrect && "bg-green-300/30",
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
            <p>{content}</p>
        </div>
    );
}

function Question ({ Q, userChoices, setUserChoices, answer, questionNumber } :
    {
        Q: any,
        userChoices: Record<string, number>,
        setUserChoices: Dispatch<SetStateAction<Record<string, number>>>,
        answer: { index: number; explanation: string } | undefined,
        questionNumber: number,
    }
) {

    return (
        <div
            id={`question-${Q.id}`}
            className={cn("rounded-lg p-5 bg-white dark:bg-secondary/25")}
        >
            <div className="flex items-center gap-2">
                <span className="bg-primary/10 text-primary font-medium rounded-full w-7 h-7 flex items-center justify-center">
                    {questionNumber}
                </span>
                <p className="font-semibold">{Q.question}</p>
            </div>
            <div className="flex flex-col gap-1 mt-4">
                {Q.choices.map((choice: string, index: number) => (
                    <Choice
                        key={choice}
                        questionId={Q.id}
                        setUserChoices={setUserChoices}
                        content={choice}
                        index={index}
                        isChosen={userChoices[Q.id] === index}
                        isCorrect={answer?.index === index}
                        isGraded={answer !== undefined}
                    />
                ))}

                {answer && (
                    <div className="mt-2">
                        <div className={cn(
                            "flex items-center gap-2 mb-1 font-medium",
                            answer.index === userChoices[Q.id] ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                        )}>
                            {answer.index === userChoices[Q.id] ? (
                                <><Check size={18} />Correct</>
                            ) : (
                                <><X size={18} />Incorrect</>
                            )}
                        </div>
                        <p className="italic text-sm bg-primary/5 p-3 rounded-md border">
                            {answer.explanation}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function QuizForm({ quiz } : { quiz: any }) {
    const [userChoices, setUserChoices] = useState<Record<string, number>>({});
    const [answers, setAnswers] = useState<Record<string, {index: number, explanation: string}>>({});
    const [score, setScore] = useState<{correct: number, total: number} | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const totalQuestions = quiz?.questions?.length || 0;
    const answeredQuestions = Object.keys(userChoices).length;

    const handleResetQuiz = () => {
        setUserChoices({});
        setAnswers({});
        setScore(null);
        setIsSubmitted(false);
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
                            userChoices={userChoices}
                            setUserChoices={setUserChoices}
                            answer={answers[Q.id]}
                            questionNumber={index + 1}
                        />
                    ))}

                    <div className="flex gap-3">
                        {!isSubmitted ? (
                            <Button
                                className="p-4 text-lg"
                                onClick={async () => {
                                    setIsSubmitted(true);
                                    const quizAns = await gradeUserChoices(quiz.id, userChoices);
                                    let correctChoices: Record<string, {index: number, explanation: string}> = {};
                                    let correctCount = 0;

                                    quizAns?.questions.forEach((question) => {
                                        correctChoices[question.id] = {
                                            index: question.answer,
                                            explanation: question.explanation
                                        };

                                        if (userChoices[question.id] === question.answer) {
                                            correctCount++;
                                        }
                                    });

                                    setAnswers(correctChoices);
                                    setScore({
                                        correct: correctCount,
                                        total: quizAns?.questions.length || 0
                                    });
                                }}
                                disabled={answeredQuestions === 0}
                            >
                                Submit Quiz
                            </Button>
                        ) : (
                            <Button
                                variant="soft"
                                className="p-4 text-lg"
                                onClick={handleResetQuiz}
                            >
                                Try Again
                            </Button>
                        )}
                    </div>
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

                        {isSubmitted && score && (
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Score:</span>
                                <span className={cn(
                                    "font-medium",
                                    score.correct === score.total ? "text-green-600 dark:text-green-400" :
                                    score.correct >= score.total / 2 ? "text-yellow-600 dark:text-yellow-400" :
                                    "text-red-600 dark:text-red-400"
                                )}>
                                    {score.correct}/{score.total}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}