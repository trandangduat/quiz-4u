import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { NextResponse } from "next/server";
import { z } from 'zod';

const QUIZ_GEN_PROMPT = `
You are an expert educational content assessor and exam writer.
You must output a JSON object that conforms exactly to the following schema:
{
  quizTitle: string,
  questions: [
    {
      question: string,
      choices: string[],     // exactly 4 options
      answer: number,        // index (0–3) of the correct option
      explanation: string    // brief rationale for the correct answer
    }
  ]
}

Formatting rules:
- Escape backslashes properly in LaTeX so the JSON is valid (e.g., \\\\frac{a}{b}).
- Use \`$...$\` for inline math and \`$$...$$\` for display math.
- Ensure output is valid JSON without comments or trailing commas.
- Do NOT include explanations or notes outside the JSON object.

Follow this structure strictly. Here’s a sample question for reference:

Example:
{
  "quizTitle": "Basic Algebra and Fractions",
  "questions": [
    {
      "question": "What is the result of simplifying $\\\\frac{2x}{4}$?",
      "choices": [
        "$\\\\frac{x}{2}$",
        "$2x$",
        "$\\\\frac{2}{x}$",
        "$x + 2$"
      ],
      "answer": 0,
      "explanation": "Dividing both numerator and denominator by 2 simplifies $\\\\frac{2x}{4}$ to $\\\\frac{x}{2}$."
    }
  ]
}

Now, generate a quiz based on the following content:
- Title should reflect the topic clearly.
- Generate exactly <numQuestions> questions.
- Each question must have:
  • Exactly four answer choices.
  • One correct answer (with the correct zero-based index in \`answer\`).
  • An explanation based on reasoning or correcting misconceptions.
`;

export async function POST(req: Request) {
const { knowledge, numQuestions } = await req.json();

   const quizSchema = z.object({
      quizTitle: z.string(),
      questions: z.array(z.object({
         question: z.string(),
         choices: z.array(z.string()).length(4),
         answer: z.number().int().min(0).max(3),
         explanation: z.string(),
      })),
   });

   const { object } = await generateObject({
      model: openai("gpt-4o-mini"),
      system: QUIZ_GEN_PROMPT,
      schema: quizSchema,
      prompt: `
         Generate exactly ${numQuestions} questions with below educational content
         ------------------------------------
         ${knowledge}
      `,
   });

   return NextResponse.json({ quiz: object });
}
