"use client"

import { createContext, ReactNode, useContext, useState } from "react";

const CurrentAttemptContext = createContext<{

  quiz: { id: string, title: string, questionsCount: number } | null;
  setQuiz: (quiz: { id: string, title: string, questionsCount: number } | null) => void;
  userChoices: Record<string, number>;
  setUserChoices: (userChoices: Record<string, number>) => void;
  startTimeUTC: number;
  setStartTimeUTC: (startTimeUTC: number) => void;
  quizDuration: number; // in milliseconds
  setQuizDuration: (quizDuration: number) => void;
}>({
  quiz: null,
  setQuiz: () => {},
  userChoices: {},
  setUserChoices: () => {},
  startTimeUTC: -1,
  setStartTimeUTC: () => {},
  quizDuration: -1,
  setQuizDuration: () => {},
});

export const CurrentAttemptProvider = ({ children } : { children: ReactNode }) => {
  const [quiz, setQuiz] = useState<{ id: string, title: string, questionsCount: number } | null>(null);
  const [userChoices, setUserChoices] = useState<Record<string, number>>({});
  const [startTimeUTC, setStartTimeUTC] = useState<number>(-1);
  const [quizDuration, setQuizDuration] = useState<number>(-1);

  return (
    <CurrentAttemptContext.Provider value={{
      quiz, setQuiz,
      userChoices, setUserChoices,
      startTimeUTC, setStartTimeUTC,
      quizDuration, setQuizDuration
    }}>
      {children}
    </CurrentAttemptContext.Provider>
  );
}

export const useCurrentAttempt = () => {
  const context = useContext(CurrentAttemptContext);
  if (!context) {
    throw new Error("useCurrentAttempt must be used within a CurrentAttemptProvider");
  }
  return context;
}