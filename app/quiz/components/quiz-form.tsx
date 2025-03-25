"use client"

import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction, useState } from "react";
import gradeUserChoices from "../[quizId]/action";

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
            className={cn("hover:bg-zinc-700", isChosen && "bg-purple-700", isGraded && isCorrect && "bg-green-800")}
            onClick={() => updateUserAnswer()}
        >
            <p>{index}. {content}</p>
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
            <p className="font-bold">{Q.question}</p>
            <div className="flex flex-col">
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
                    <p className="italic">
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
                <button
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
                </button>
            </div>
        </>
    );
}