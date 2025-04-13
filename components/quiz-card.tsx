import { ClipboardList, MoreVertical, Pencil, Trash2 } from "lucide-react";
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
        <div
            className=" bg-card dark:bg-secondary/25 rounded-md p-6 h-full relative">
            <div className="flex items-center gap-4">
                <div className="bg-primary-200/50 dark:bg-secondary-400/50 group-hover:bg-primary-300/50 dark:group-hover:bg-secondary-300 transition-colors rounded-full p-4">
                    <ClipboardList size={32} strokeWidth={1.25} />
                </div>
                <div className="flex flex-col items-start gap-1">
                    <div>
                        <Link href={quizLink}>
                            <span className="font-bold text-primary-900 hover:underline hover:underline-offset-5 transition-colors">{quizInfo?.title || 'Quiz Generated'}</span>
                        </Link>
                    </div>
                    <div className="flex flex-wrap gap-2 font-medium">
                        <div className="inline-block text-xs">
                            <span>{quizInfo?.questionCount || 0} questions</span>
                        </div>
                        {quizInfo?.createdAt && (
                            <div className="inline-block text-xs text-muted-foreground">
                                <span>Created {new Date(quizInfo.createdAt).toLocaleDateString()}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}