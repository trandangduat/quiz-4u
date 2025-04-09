"use client";

import { cn } from "@/lib/utils";
import { Geist } from "next/font/google";
import { useEffect, useRef } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default function StreamingKnowledge({
    currentStage,
    extractingKnowledge,
}: {
    currentStage: number;
    extractingKnowledge: string;
}) {
    const streamingKnowledgeRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const { scrollHeight, clientHeight } = streamingKnowledgeRef.current!;
        if (scrollHeight > clientHeight) {
            streamingKnowledgeRef.current?.scrollTo({
                top: scrollHeight,
                behavior: "smooth",
            });
        }
    }, [extractingKnowledge]);

    return (
        <div 
            className={cn(
                currentStage >= 2 ? "opacity-100" : "opacity-0",
                "before:h-20 after:h-20",
                "transition-all bg-secondary/20 text-secondary-700 rounded-md py-2 px-4 text-[12px] max-h-64 overflow-hidden",
                "before:absolute before:top-0 before:left-0 before:right-0 before:bg-gradient-to-b before:from-secondary-50 before:to-transparent before:rounded-md",
                "after:absolute after:bottom-0 after:left-0 after:right-0 after:bg-gradient-to-t after:from-secondary-50 after:to-transparent after:rounded-md",
                geistSans.className,
            )}
            ref={streamingKnowledgeRef}
        >
            {extractingKnowledge}
        </div>
    );
}