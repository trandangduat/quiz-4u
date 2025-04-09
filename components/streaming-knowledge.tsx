"use client";

import { cn } from "@/lib/utils";
import { Geist } from "next/font/google";
import { useEffect, useRef, useState } from "react";

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
    const [needScroll, setNeedScroll] = useState(false);
    
    useEffect(() => {
        const { scrollHeight, clientHeight } = streamingKnowledgeRef.current!;
        if (scrollHeight > clientHeight) {
            setNeedScroll(true);
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
                needScroll ? "before:h-20 after:h-20" : "before:h-0 after:h-0",
                "bg-linear-to-tl from-secondary/20 to-transparent text-secondary-700 rounded-md py-2 px-4 text-[12px] max-h-64 overflow-hidden",
                "before:transition-all before:absolute before:top-0 before:left-0 before:right-0 before:bg-gradient-to-b before:from-secondary-50/80 before:to-transparent before:rounded-md",
                "after:transition-all after:absolute after:bottom-0 after:left-0 after:right-0 after:bg-gradient-to-t after:from-secondary-50/80 after:to-transparent after:rounded-md",
                geistSans.className,
            )}
            ref={streamingKnowledgeRef}
        >
            {extractingKnowledge}
        </div>
    );
}