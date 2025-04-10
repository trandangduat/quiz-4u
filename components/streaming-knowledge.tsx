"use client";

import { cn } from "@/lib/utils";
import { Geist } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";

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
    const [shouldMount, setShouldMount] = useState(false);
    
    useEffect(() => {
        if (extractingKnowledge.length > 0 && !shouldMount) {
            setShouldMount(true);
            return;
        }
        if (!streamingKnowledgeRef.current) {
            return;
        }
        const { scrollHeight, clientHeight } = streamingKnowledgeRef.current!;
        if (scrollHeight > clientHeight) {
            setNeedScroll(true);
            streamingKnowledgeRef.current?.scrollTo({
                top: scrollHeight,
                behavior: "smooth",
            });
        }
    }, [extractingKnowledge]);
    
    if (!shouldMount) {
        return null;
    }

    return (
        <div className="animate-slide-in">
            <div 
                className={cn(
                    needScroll ? "before:h-10 after:h-10" : "before:h-0 after:h-0",
                    "bg-linear-to-tl border from-secondary/50 to-transparent rounded-md py-4 px-6 max-h-64 overflow-y-auto",
                    "before:transition-all before:absolute before:top-0 before:left-0 before:right-0 before:bg-gradient-to-b before:from-secondary-200/50 before:to-transparent before:rounded-md",
                    "after:transition-all after:absolute after:bottom-0 after:left-0 after:right-0 after:bg-gradient-to-t after:from-secondary-200/50 after:to-transparent after:rounded-md",
                    geistSans.className,
                )}
                ref={streamingKnowledgeRef}
            >
                <article className="prose prose-sm dark:prose-invert prose-headings:text-secondary-800 prose-slate text-secondary-700">
                    <Markdown>{extractingKnowledge}</Markdown>
                </article>
            </div>
        </div>
    );
}