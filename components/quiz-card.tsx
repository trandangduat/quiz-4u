import { ClipboardList } from "lucide-react";
import Link from "next/link";

export default function QuizCard({ quizLink, quizInfo } : {
  quizLink: string,
  quizInfo: {
    title: string,
    questionCount: number,
    createdAt?: Date | string
  }
}) {
    return (
        <Link href={quizLink}>
            <div
                className="
                    bg-card dark:bg-secondary/25 rounded-md p-6
                    group dark:hover:bg-secondary/50 hover:scale-103
                    active:scale-100 transition-all duration-200 ease-in-out
                ">
                <div className="flex items-center gap-4">
                    <div className="bg-primary-200/50 dark:bg-secondary-400/50 group-hover:bg-primary-300/50 dark:group-hover:bg-secondary-300 transition-colors rounded-full p-4">
                        <ClipboardList size={32} strokeWidth={1.25} />
                    </div>
                    <div className="flex flex-col items-start gap-1">
                        <div>
                            <span className="font-bold dark:text-primary-900 transition-colors">{quizInfo?.title || 'Quiz Generated'}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 font-medium">
                            <div className="inline-block text-xs">
                                <span>{quizInfo?.questionCount || 0} questions</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}