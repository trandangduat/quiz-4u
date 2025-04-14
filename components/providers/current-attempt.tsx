"use client"

import { createContext, ReactNode, useContext, useState } from "react";

const CurrentAttemptContext = createContext<{
  quizId: string;
  setQuizId: (quizId: string) => void;
  userChoices: Record<string, number>;
  setUserChoices: (userChoices: Record<string, number>) => void;
  startTimeUTC: number;
  setStartTimeUTC: (startTimeUTC: number) => void;
  quizDuration: number;
  setQuizDuration: (quizDuration: number) => void;
}>({
  quizId: "",
  setQuizId: () => {},
  userChoices: {},
  setUserChoices: () => {},
  startTimeUTC: -1,
  setStartTimeUTC: () => {},
  quizDuration: -1,
  setQuizDuration: () => {},
});

export const CurrentAttemptProvider = ({ children } : { children: ReactNode }) => {
  const [quizId, setQuizId] = useState<string>("");
  const [userChoices, setUserChoices] = useState<Record<string, number>>({});
  const [startTimeUTC, setStartTimeUTC] = useState<number>(-1);
  const [quizDuration, setQuizDuration] = useState<number>(-1);

  return (
    <CurrentAttemptContext.Provider value={{
      quizId, setQuizId,
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