"use client"

import { CartesianGrid, Line, LineChart } from "recharts"
import { ChartConfig, ChartContainer } from "./ui/chart"

type ChartProps = {
    chartData: { attemptId: number, score: number }[];
}

export default function AttemptsScoreChart({chartData} : ChartProps) {
    const chartConfig = {
        score: {
            label: "score",
            color: "var(--primary)"
        }
    } satisfies ChartConfig;

    return (
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <LineChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <Line
                    dataKey="score"
                    type="natural"
                />
            </LineChart>
        </ChartContainer>
    )
}