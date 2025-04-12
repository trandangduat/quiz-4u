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
    // Format the date if it exists
    const formattedDate = quizInfo.createdAt ? new Date(quizInfo.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }) : null;

    return (
        <Link href={quizLink}>
            <div
                className="
                    bg-card dark:bg-secondary/25 rounded-md py-4 px-6
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
                            <div className="bg-primary-200/50 dark:bg-secondary-300/50 text-primary-800 px-3 py-0.5 rounded-md inline-block text-[12px]">
                                <span>{quizInfo?.questionCount || 0} questions</span>
                            </div>
                            {formattedDate && (
                                <div className="bg-primary-200/50 dark:bg-secondary-300/50 text-primary-700 px-3 py-0.5 rounded-md inline-block text-[12px]">
                                    <span>Created: {formattedDate}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}