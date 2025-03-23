"use client"

import { cn } from "@/utils";
import { Dispatch, SetStateAction, useState } from "react";

function Choice({ content, index, questionId, isChosen, setUserChoices } : 
    { 
        content: string,
        index: number,
        questionId: number,
        isChosen: boolean,
        setUserChoices: Dispatch<SetStateAction<Record<string, number>>>
    }
) {

    function updateUserAnswer() {
        setUserChoices(prevChoices => {
            return { ...prevChoices, [questionId]: index };
        });
    }

    return (
        <div
            className={cn("hover:bg-zinc-700", isChosen && "bg-purple-700")}
            onClick={() => updateUserAnswer()}
        >
            <p>{index}. {content}</p>
        </div>
    );
}

function Question ({ Q, userChoices, setUserChoices } : 
    { 
        Q: any,
        userChoices: Record<string, number>,
        setUserChoices: Dispatch<SetStateAction<Record<string, number>>>
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
                    />
                ))}
            </div>
        </div>
    );
}

export default function QuizForm({ quiz } : { quiz: any }) {
    const [userChoices, setUserChoices] = useState<Record<string, number>>({});
    return (
        <>
            <div className="flex flex-col gap-8">
                {quiz?.questions.map((Q: any) => (
                    <Question 
                        Q={Q} 
                        key={Q.id} 
                        userChoices={userChoices}
                        setUserChoices={setUserChoices}
                    />
                ))}
                <button>Submit</button>
            </div>
        </>
    );
}