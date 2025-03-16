type QuizQuestion = {
    question: string;
    choices: string[];
    answer: number;
    explaination: string;
};

export type Quiz = {
    quizTitle: string;
    questions: QuizQuestion[];
};