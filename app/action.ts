"use server"

import { prisma } from "@/lib/prisma";
import { Quiz } from "@/types/quiz";

export async function createQuiz(quiz: Quiz, userId: string, knowledge: string) {
    const { quizTitle, questions } = quiz;
    try {
        const knowledgeEntry = await prisma.knowledge.create({
            data: {
                content: knowledge,
                creatorId: userId,
                quizzes: {
                    create: {
                        title: quizTitle,
                        creatorId: userId,
                        questions: {
                            create: questions.map(q => ({
                                question: q.question,
                                choices: q.choices,
                                answer: q.answer,
                                explanation: q.explanation,
                            }))
                        }
                    }
                }
            },
            include: {
                quizzes: {
                    include: {
                        questions: true,
                        creator: true
                    }
                }
            }
        });
        
        const createdQuiz = knowledgeEntry.quizzes[0];
        console.log(createdQuiz);
        return {
            id: createdQuiz.id,
            title: createdQuiz.title,
            questionCount: createdQuiz.questions.length,
            createdAt: createdQuiz.createdAt,
        };
    } catch (e) {
        console.error(e);
        return "Error";
    }
}