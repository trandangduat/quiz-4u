type QuizQuestion = {
    question: string;
    choices: string[];
    answer: number;
    explanation: string;
};

export type Quiz = {
    quizTitle: string;
    questions: QuizQuestion[];
};