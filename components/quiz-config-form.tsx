"use client"

import { ArrowRight, LoaderCircle } from "lucide-react"
import { Button } from "./ui/button"
import { use, useState } from "react";
import { useCurrentAttempt } from "./providers/current-attempt";
import { useRouter } from "next/navigation";

export default function QuizConfigForm({ quizId, quizTitle, questionsCount }:
  {
    quizId: string;
    quizTitle: string;
    questionsCount: number;
  }) {
  const [shuffle, setShuffle] = useState<boolean>(false);
  const [enableTimeLimit, setEnableTimeLimit] = useState<boolean>(false);
  const [timeLimit, setTimeLimit] = useState<number>(0); // in minutes
  const [loading, setLoading] = useState<boolean>(false);

  const currentAttempt = useCurrentAttempt();
  const router = useRouter();

  const startQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    currentAttempt.setQuiz({
      id: quizId,
      title: quizTitle,
      questionsCount: questionsCount,
    });
    currentAttempt.setUserChoices({});
    currentAttempt.setStartTimeUTC(-1);
    currentAttempt.setQuizDuration(enableTimeLimit ? timeLimit * 60 * 1000 : -1);

    router.push(`/quiz/${quizId}/attempt`);
  };

  return (
    <form>
      <div className="flex flex-col gap-4">
          <div className="flex flex-row gap-2 items-center">
              <input
                type="checkbox" id="shuffle" className="cursor-pointer"
                checked={shuffle}
                onChange={() => setShuffle(!shuffle)}
              />
              <label htmlFor="shuffle" className="text-sm cursor-pointer">Shuffle questions</label>
          </div>
          <div className="flex flex-row gap-2 items-center">
              <input
                type="checkbox" id="enable-timelimit" className="cursor-pointer"
                checked={enableTimeLimit}
                onChange={() => setEnableTimeLimit(!enableTimeLimit)}
              />
              <label htmlFor="enable-timelimit" className="text-sm cursor-pointer">Set time limit</label>
          </div>
          <div>
              <input
                type="range" id="timelimit" min="0" max="60" step="1" className="w-full cursor-pointer"
                value={timeLimit}
                onChange={(e) => setTimeLimit(Number(e.target.value))}
              />
          </div>
          {shuffle ? "Shuffle questions" : "Do not shuffle questions"}
          <br></br>
          {enableTimeLimit ? `Time limit: ${timeLimit} minutes` : "No time limit"}

      </div>
      <div className="flex justify-end mt-8">
          <Button
            type="submit"
            className="font-semibold flex flex-row gap-2 items-center cursor-pointer"
            onClick={startQuiz}
            disabled={loading}
          >
            {loading ? <LoaderCircle size={16} className="animate-spin" /> : <ArrowRight size={16} /> }
              Let's go
          </Button>
      </div>
    </form>
  )
}