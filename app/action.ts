"use server"

import prisma from "@/lib/prisma";
import { Quiz } from "@/types/quiz";

export async function createQuiz(quiz: Quiz) {
    const { quizTitle, questions } = quiz;
    const res = await prisma.post.create({
        data: {
            title: quizTitle,
            content: questions,
        }
    });
    console.log(res);
}