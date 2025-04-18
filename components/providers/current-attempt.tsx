"use client"

import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";

const CurrentAttemptContext = createContext<{
  quiz: { id: string, title: string, questionsCount: number } | null;
  setQuiz: (quiz: { id: string, title: string, questionsCount: number } | null) => void;
  userChoices: Record<string, number>;
  setUserChoices: Dispatch<SetStateAction<Record<string, number>>>;
  startTimeUTC: number;
  setStartTimeUTC: Dispatch<SetStateAction<number>>;
  quizDuration: number; // in milliseconds
  setQuizDuration: Dispatch<SetStateAction<number>>;
  attemptId: string | null;
  setAttemptId: Dispatch<SetStateAction<string | null>>;
}>({
  quiz: null,
  setQuiz: () => {},
  userChoices: {},
  setUserChoices: () => {},
  startTimeUTC: -1,
  setStartTimeUTC: () => {},
  quizDuration: -1,
  setQuizDuration: () => {},
  attemptId: null,
  setAttemptId: () => {},
});

export const CurrentAttemptProvider = ({ children } : { children: ReactNode }) => {
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [quiz, setQuiz] = useState<{ id: string, title: string, questionsCount: number } | null>(null);
  const [userChoices, setUserChoices] = useState<Record<string, number>>({});
  const [startTimeUTC, setStartTimeUTC] = useState<number>(-1);
  const [quizDuration, setQuizDuration] = useState<number>(-1);

  useEffect(() => {
    if (attemptId) {
      return;
    }
    // check if there's already an attempt ongoing in database
    const checkExistingAttempt = async () => {
      const response = await fetch("/api/attempt/check-ongoing");
      const data = (await response.json())[0];
      if (data !== undefined) {
        setAttemptId(data.id);
        setQuiz({
          id: data.quizId,
          title: data.quizTitle,
          questionsCount: data.questionsCount
        });
        setUserChoices(data.userChoices);
        setStartTimeUTC(new Date(data.quizStartTime).getTime());
        setQuizDuration(data.quizDuration);
      }
    };
    checkExistingAttempt();
  }, [])

  useEffect(() => {
    if (!quiz || startTimeUTC < 0) {
      return;
    }

    const updateAttempt = async() => {
      console.log("update attempt ", attemptId);

      const result = await fetch("/api/attempt/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          attemptId,
          userChoices,
        })
      });
    }

    const saveAttempt = async() => {
      console.log("create attempt ", quiz?.id, quizDuration, startTimeUTC);

      const result = await fetch("/api/attempt/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          quizId: quiz?.id,
          quizDuration,
          quizStartTime: new Date(startTimeUTC)
        })
      });

      const attempt = await result.json();
      setAttemptId(attempt.id);
    }

    if (!attemptId) {
      saveAttempt();
    } else {
      updateAttempt()
    }

  }, [quiz, userChoices, startTimeUTC, quizDuration]);

  return (
    <CurrentAttemptContext.Provider value={{
      quiz, setQuiz,
      userChoices, setUserChoices,
      startTimeUTC, setStartTimeUTC,
      quizDuration, setQuizDuration,
      attemptId, setAttemptId
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