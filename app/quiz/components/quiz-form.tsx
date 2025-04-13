"use client"

import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction, useState } from "react";
import gradeUserChoices from "../[quizId]/action";
import { Button } from "@/components/ui/button";

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
                "flex items-center gap-4 px-4 py-2 rounded-md ",
                !isGraded && !isChosen && "hover:bg-secondary/35 cursor-pointer transition-colors",
                isChosen && "bg-secondary/75",
                isChosen && isGraded && !isCorrect && "bg-red-500/20",
                isGraded && isCorrect && "bg-green-300/30",
            )}
            onClick={() => updateUserAnswer()}
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

function Question ({ Q, userChoices, setUserChoices, answer } :
    {
        Q: any,
        userChoices: Record<string, number>,
        setUserChoices: Dispatch<SetStateAction<Record<string, number>>>,
        answer: { index: number; explanation: string }
    }
) {

    return (
        <div>
            <p className="font-semibold">{Q.question}</p>
            <div className="flex flex-col gap-2 p-4">
                {Q.choices.map((choice: string, index: number) => (
                    <Choice
                        key={choice}
                        questionId={Q.id}
                        setUserChoices={setUserChoices}
                        content={choice}
                        index={index}
                        isChosen={userChoices[Q.id] == index}
                        isCorrect={answer?.index == index}
                        isGraded={answer !== undefined}
                    />
                ))}
                {answer && (
                    <p className="italic text-sm bg-primary/5 p-3 rounded-md border">
                        {answer.explanation}
                    </p>
                )}
            </div>
        </div>
    );
}

export default function QuizForm({ quiz } : { quiz: any }) {
    const [userChoices, setUserChoices] = useState<Record<string, number>>({});
    const [answers, setAnswers] = useState<Record<string, {index: number, explanation: string}>>({});

    return (
        <>
            <div className="mb-10">
                <h1 className="text-3xl font-bold">{quiz.title}</h1>
            </div>
            <div className="flex flex-col gap-8">
                {quiz?.questions.map((Q: any) => (
                    <Question
                        Q={Q}
                        key={Q.id}
                        userChoices={userChoices}
                        setUserChoices={setUserChoices}
                        answer={answers[Q.id]}
                    />
                ))}
                <Button
                    className="p-4 text-lg"
                    onClick={async () => {
                        const quizAns = await gradeUserChoices(quiz.id, userChoices);
                        let correctChoices: Record<string, {index: number, explanation: string}> = {};
                        quizAns?.questions.forEach((question) => {
                            correctChoices[question.id] = {
                                index: question.answer,
                                explanation: question.explanation
                            };
                        });

                        setAnswers(correctChoices);
                    }}
                >
                    Submit
                </Button>
            </div>
        </>
    );
}