"use client"

import { QuizQuestion } from "@/types/quiz";
import { useState } from "react";

function Choice({ content } : { content: string }) {
    return (
        <div>
            <p>{content}</p>
        </div>
    );
}

function Question ({ Q } : { Q: QuizQuestion }) {
    return (
        <div>
            <p className="font-bold">{Q.question}</p>
            {Q.choices.map(choice => (
                <Choice key={choice} content={choice} />
            ))}
        </div>
    );
}

export default function QuizForm({ quiz } : { quiz: any }) {
    const [userChoices, setUserChoices] = useState({});
    return (
        <>
            <div className="flex flex-col gap-8">
                {quiz?.questions.map(Q => (
                    <Question Q={Q} key={Q.id} />
                ))}
                <button>Submit</button>
            </div>
        </>
    );
}