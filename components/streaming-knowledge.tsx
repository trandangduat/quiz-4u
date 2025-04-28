"use client";

import { cn } from "@/lib/utils";
import { useContext, useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import 'katex/dist/katex.min.css'

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
                "bg-card max-h-80 dark:bg-secondary/30 rounded-md py-4 px-6 overflow-y-auto custom-scrollbar"
            )}
            ref={streamingKnowledgeRef}
        >
            <article className="prose prose-sm dark:prose-invert prose-slate mx-auto prose-headings:text-primary-800 prose-p:text-primary-700 prose-strong:text-primary-800 prose-li:text-primary-700 prose-a:text-primary-800">
                <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {extractingKnowledge}
                </Markdown>
            </article>
        </div>
    );
}