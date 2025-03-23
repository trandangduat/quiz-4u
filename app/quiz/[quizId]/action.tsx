"use server"

import { prisma } from "@/lib/prisma";

export default async function gradeUserChoices(quizId: string, userChoices: any) {
    try {
        const quizAns = await prisma.quiz.findUnique({
            where: {
                id: quizId,
            },
            include: {
                questions: {
                    select: {
                        id: true,
                        answer: true,
                        explanation: true
                    }
                },
            }
        });

        return quizAns;
    } catch (error) {
        console.error("Error grading quiz:", error);
        throw error;
    }
}