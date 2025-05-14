"use client"

import { useState } from "react";
import QuizCard from "./quiz-card";

export default function QuizCardPanel({ createdQuizzes } : {
    createdQuizzes: any;
}) {

  const [chosenQuiz, setChosenQuiz] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr gap-6">
      {createdQuizzes.map((quiz: any) => (
        <QuizCard
          chosenQuiz={chosenQuiz}
          setChosenQuiz={setChosenQuiz}
          key={quiz.id}
          quizLink={`/quiz/${quiz.id}`}
          quizInfo={{
            id: quiz.id,
            title: quiz.title,
            questionCount: quiz.questions.length,
            createdAt: quiz.createdAt
          }}
        />
      ))}
    </div>
  );
}
