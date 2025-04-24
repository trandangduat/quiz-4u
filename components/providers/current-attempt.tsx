"use client"

import { useRouter } from "next/navigation";
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
  minutes: number;
  seconds: number;
  reset: () => void;
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
  minutes: -1,
  seconds: -1,
  reset: () => {},
});

export const CurrentAttemptProvider = ({ children } : { children: ReactNode }) => {
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [quiz, setQuiz] = useState<{ id: string, title: string, questionsCount: number } | null>(null);
  const [userChoices, setUserChoices] = useState<Record<string, number>>({});
  const [startTimeUTC, setStartTimeUTC] = useState<number>(-1);
  const [quizDuration, setQuizDuration] = useState<number>(-1);
  const [minutes, setMinutes] = useState<number>(-1);
  const [seconds, setSeconds] = useState<number>(-1);
  const reset = () => {
    setQuiz(null);
    setStartTimeUTC(-1);
    setQuizDuration(-1);
    setUserChoices({});
    setAttemptId(null);
    setMinutes(-1);
    setSeconds(-1);
  };
  const router = useRouter();

  useEffect(() => {
    if (!attemptId || quizDuration < 0) {
      return;
    }
    const setTime = () => {
      const elapsed = Math.max(0, Date.now() - startTimeUTC);
      const remaining = Math.max(0, quizDuration - elapsed);
      if (remaining <= 0) {
        router.push(`/quiz/${quiz?.id}/attempt/${attemptId}`);
        reset();
      }
      setMinutes(Math.floor((remaining / 1000 / 60)));
      setSeconds(Math.floor((remaining / 1000) % 60));
    };
    setTime();
    const interval = setInterval(setTime, 500);

    return () => clearInterval(interval)
  }, [startTimeUTC, quizDuration, attemptId]);

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
    if (!quiz || startTimeUTC < 0 || !attemptId) {
      return;
    }

    const updateAttempt = async() => {
      console.log("updating attempt... ", attemptId);

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
    updateAttempt()
  }, [quiz, userChoices, startTimeUTC, quizDuration, attemptId]);

  return (
    <CurrentAttemptContext.Provider value={{
      quiz, setQuiz,
      userChoices, setUserChoices,
      startTimeUTC, setStartTimeUTC,
      quizDuration, setQuizDuration,
      attemptId, setAttemptId,
      minutes, seconds,
      reset
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