"use client"

import { useState } from "react";
import QuizCard from "./quiz-card";
import { Prisma, Quiz } from "@prisma/client";

type CreatedQuizzesType = Prisma.QuizGetPayload<{
    include: {
      questions: true,
      attempts: true
    },
}>;

export default function QuizCardPanel({ createdQuizzes } : {
    createdQuizzes: CreatedQuizzesType[];
}) {

  const [chosenQuiz, setChosenQuiz] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr gap-6">
      {createdQuizzes.map((quiz) => {
        let attemptsCount: number = 0;
        let avgScore: number = 0;
        let maxScore: number = -1;
        for (let a of quiz.attempts) {
          attemptsCount++;
          avgScore += a.correctedAnswers;
          if (maxScore === -1 || maxScore < a.correctedAnswers) {
            maxScore = a.correctedAnswers;
          }
        }
        if (quiz.attempts.length > 0) {
          avgScore /= quiz.attempts.length;
        } else {
          maxScore = 0;
        }

        return (
          <QuizCard
            chosenQuiz={chosenQuiz}
            setChosenQuiz={setChosenQuiz}
            key={quiz.id}
            quizLink={`/quiz/${quiz.id}`}
            quizInfo={{
              id: quiz.id,
              title: quiz.title,
              questionCount: quiz.questions.length,
              createdAt: quiz.createdAt,
              attemptsCount,
              avgScore,
              maxScore
            }}
          />
        )
      })}
    </div>
  );
}
