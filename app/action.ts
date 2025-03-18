"use server"

import prisma from "@/lib/prisma";
import { Quiz } from "@/types/quiz";

export async function createQuiz(quiz: Quiz) {
    const { quizTitle, questions } = quiz;
    try {
        const res = await prisma.quiz.create({
            data: {
                title: quizTitle,
                questions: {
                    create: questions.map(q => ({
                        question: q.question,
                        choices: q.choices,
                        answer: q.answer,
                        explanation: q.explanation,
                    }))
                }
            },
            include: {
                questions: true,
            }
        });
        console.log(res);
        return res.id;
    } catch (e) {
        console.error(e);
        return "Error";
    }
}