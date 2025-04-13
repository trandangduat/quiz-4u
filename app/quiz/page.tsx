import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma"
import QuizCard from "@/components/quiz-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

async function Quizzes() {
  const session = await auth();
  if (!session?.user) {
    return (
      <div className="flex flex-col items-center justify-center py-10 px-4">
        <h1 className="text-2xl font-bold mb-4">Sign in to view your quizzes</h1>
        <p className="text-muted-foreground mb-6">You need to be signed in to create and access your quizzes.</p>
        <Link href="/api/auth/signin">
          <Button>Sign in</Button>
        </Link>
      </div>
    );
  }

  const createdQuizzes = await prisma.quiz.findMany({
    where: {
      creatorId: session?.user?.id
    },
    include: {
      questions: true
    },
    orderBy: {
      createdAt: 'desc' // Sort by most recent first
    }
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {createdQuizzes.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <h2 className="text-xl font-semibold mb-2">No quizzes yet</h2>
          <p className="text-muted-foreground mb-6">Create your first quiz to get started</p>
          <Link href="/quiz/create">
            <Button>Create New Quiz</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {createdQuizzes.map((quiz) => (
            <QuizCard
              key={quiz.id}
              quizLink={`/quiz/${quiz.id}`}
              quizInfo={{
                title: quiz.title,
                questionCount: quiz.questions.length
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default async function Page() {
  return <Quizzes />;
}