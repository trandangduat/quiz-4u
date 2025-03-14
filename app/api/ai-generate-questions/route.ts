import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { NextResponse } from "next/server";
import { z } from 'zod';

const QUIZ_GEN_PROMPT = `
Generate multiple choice questions based on the educational content below. Requirements:

1. Create ONLY multiple choice questions (MCQs) that test understanding of ALL key concepts, facts, and relationships in the material
2. Each question must have exactly 4 options
3. Ensure ONE and only one option is correct
4. Make all incorrect options (distractors) plausible and relevant
5. If the subject is heavily mathematical:
   - Create MORE questions focused on calculations, equations, and problem-solving
   - Include questions that test application of formulas and mathematical concepts
   - Ensure distractors include common calculation errors
   - Prioritize mathematical content over purely theoretical concepts
6. For each question, include:
   - A clear question text
   - Four answer choices as separate strings
   - The correct answer's index (0-3)
   - A brief explanation of why the correct answer is right AND why other options are incorrect
7. Distribute questions across ALL critical topics with emphasis on:
   - High-value concepts likely to appear on exams
   - Common misconceptions and frequently confused concepts
   - Edge cases and exception scenarios that test deeper understanding
8. Include questions that mimic real exam patterns:
   - Use scenario-based questions that require applying knowledge to new situations
   - Include questions with "All of the above" or "None of the above" options when appropriate
   - Create questions that integrate multiple concepts to test comprehensive understanding
9. Vary the cognitive demand level:
   - 25% knowledge/recall questions
   - 50% application/analysis questions
   - 25% synthesis/evaluation questions
10. Questions must be in the same language as the source material
11. For content with visual elements (charts, diagrams, etc.), create questions that test interpretation of visual information
`;

export async function POST(req: Request) {
    const { knowledge, numQuestions } = await req.json();

    const quizSchema = z.object({
        quizTitle: z.string(),
        questions: z.array(z.object({
            question: z.string(),
            choices: z.array(z.string()),
            answer: z.number(),
            explanation: z.string(),
        })),
    });

    const { object } = await generateObject({
        model: openai("gpt-4o-mini"),
        system: QUIZ_GEN_PROMPT,
        schema: quizSchema,
        prompt: `Generate a quiz of ${numQuestions} with below knowledge:\n ${knowledge}`,
    });

    return NextResponse.json({ quiz: object });
}