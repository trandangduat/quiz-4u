import dayjs from "dayjs";
import { ClipboardList, Clock, List, MoreVertical, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export default function QuizCard({ quizLink, quizInfo } : {
  quizLink: string,
  quizInfo: {
    title: string,
    questionCount: number,
    createdAt?: Date
  }
}) {
    return (
        <div
            className="group bg-card dark:bg-secondary/25 rounded-md p-6 h-full relative transition-all duration-200 border-3 border-transparent hover:border-primary shadow-none shadow-secondary/70 hover:shadow-2xl inset-shadow-secondary hover:inset-shadow-sm"
        >
            <div className="flex items-center gap-4">
                <div className="flex flex-col items-start gap-3">
                    <div>
                        <Link href={quizLink}>
                            <span className="font-bold text-lg tracking-tight">{quizInfo?.title || 'Unnamed'}</span>
                        </Link>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground font-semibold">
                        <div className="inline-flex gap-1 items-center">
                            <List size={16} />
                            <span>{quizInfo?.questionCount || 0} questions</span>
                        </div>
                        <div className="inline-flex gap-1 items-center">
                            <Clock size={16} />
                            <span>{dayjs(quizInfo?.createdAt).fromNow()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}