"use client"

import { ArrowRight, LoaderCircle, Shuffle, Timer } from "lucide-react"
import { Button } from "./ui/button"
import { use, useState } from "react";
import { useCurrentAttempt } from "./providers/current-attempt";
import { useRouter } from "next/navigation";
import { Attempt } from "@prisma/client";
import { Slider } from "./ui/slider";
import { Checkbox } from "./ui/checkbox";
import { Switch } from "./ui/switch";

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
  const {
    setAttemptId,
    setQuiz,
    setUserChoices,
    setStartTimeUTC,
    setQuizDuration
  } = useCurrentAttempt();
  const router = useRouter();

  const startAttempt = async(e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log("creating attempt... ", quizId, timeLimit * 60 * 1000);

    const result = await fetch("/api/attempt/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        quizId: quizId,
        quizDuration: timeLimit * 60 * 1000,
        quizStartTime: new Date()
      })
    });

    const attempt: Attempt = await result.json();

    setAttemptId(attempt.id);
    setQuiz({
      id: quizId,
      title: quizTitle,
      questionsCount: questionsCount,
    });
    setUserChoices({});
    setStartTimeUTC(new Date(attempt.quizStartTime).getTime());
    setQuizDuration(attempt.quizDuration);

    router.push(`/quiz/${quizId}/attempt`);
  };

  return (
    <form>
      <div className="flex flex-col gap-6 py-4 px-4">
          <div>
            <div className="flex flex-row gap-2 items-center justify-between">
              <div className="space-y-1.5">
                <label htmlFor="shuffle" className="cursor-pointer flex gap-2 items-center">
                  <Shuffle size={18}/>
                  Shuffle questions
                </label>
                <p className="text-muted-foreground text-xs">Randomize the order of questions for a new challenge</p>
              </div>
                <Switch
                  id="shuffle"
                  checked={shuffle}
                  onCheckedChange={(checked: boolean) => setShuffle(checked)}
                />
            </div>
          </div>
          <div>
            <div className="flex flex-row gap-2 items-center justify-between">
              <div className="space-y-1.5">
                <label htmlFor="enable-timelimit" className="cursor-pointer flex gap-2 items-center">
                  <Timer size={18} />
                  Set time limit
                </label>
                <p className="text-muted-foreground text-xs">Leave this option off to stay in practice mode</p>
              </div>
              <Switch
                id="enable-timelimit"
                checked={enableTimeLimit}
                onCheckedChange={(checked: boolean) => setEnableTimeLimit(checked)}
              />
            </div>
            <div className="mt-5">
              <div className="w-full flex flex-row justify-center mb-5">
                <div className="flex flex-col items-center">
                  <span className="text-4xl font-bold">{timeLimit}</span>
                  <span>minutes</span>
                </div>
              </div>
              <Slider
                value={[timeLimit]}
                onValueChange={(value) => setTimeLimit(value[0])}
                defaultValue={[0]}
                max={60}
                step={1}
                disabled={!enableTimeLimit}
              />
            </div>
          </div>
      </div>
      <div className="flex justify-end mt-8">
          <Button
            type="submit"
            className="font-semibold flex flex-row gap-2 items-center cursor-pointer"
            onClick={startAttempt}
            disabled={loading}
          >
            {loading ? <LoaderCircle size={16} className="animate-spin" /> : <ArrowRight size={16} /> }
              Let's go
          </Button>
      </div>
    </form>
  )
}