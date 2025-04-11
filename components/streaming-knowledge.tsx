"use client";

import { cn } from "@/lib/utils";
import { Geist } from "next/font/google";
import { useContext, useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default function StreamingKnowledge({
    extractingKnowledge,
}: {
    extractingKnowledge: string;
}) {
    const streamingKnowledgeRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        if (!streamingKnowledgeRef.current) {
            return;
        }
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
                "bg-linear-to-tl border from-secondary/50 to-transparent rounded-md py-4 px-6 max-h-64 overflow-y-auto",
                geistSans.className,
                "custom-scrollbar"
            )}
            ref={streamingKnowledgeRef}
        >
            <article className="prose prose-sm dark:prose-invert prose-headings:text-secondary-800 prose-slate text-secondary-700">
                <Markdown>{extractingKnowledge}</Markdown>
            </article>
        </div>
    );
}