"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart"

type ChartProps = {
    chartData: { attemptId: number, score: number }[];
}

export default function AttemptsScoreChart({chartData} : ChartProps) {
    const chartConfig = {
        score: {
            label: "Score",
            color: "var(--primary)"
        }
    } satisfies ChartConfig;

    return (
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <LineChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="attemptId"
                    axisLine={false}
                    tickLine={false}
                    tickMargin={10}
                />
                <YAxis
                    hide={true}
                    dataKey="score"
                    width={25}
                    axisLine={false}
                    tickLine={false}
                    tickMargin={10}
                    domain={[0, 10]}
                    scale="linear"
                />
                <ChartTooltip content={<ChartTooltipContent hideLabel={true} className="bg-card text-sm" />} />
                <Line
                    dataKey="score"
                    type="monotone"
                    strokeWidth={3}
                    stroke="var(--color-score)"
                    fill="var(--color-score)"
                />
            </LineChart>
        </ChartContainer>
    )
}