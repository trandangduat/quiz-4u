import dayjs from "dayjs";
import { ChevronsRight, ClipboardList, Clock, List, MoreVertical, Pencil, SquareChevronRight, Trash2 } from "lucide-react";
import Link from "next/link";
import relativeTime from "dayjs/plugin/relativeTime";
import { cn } from "@/lib/utils";
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
        <Link href={quizLink}>
            <div
                className={cn(
                    "group bg-card/50 dark:bg-secondary/15 rounded-md p-6 h-full relative transition-all overflow-clip duration-200 border-1 dark:border-primary/15 hover:border-primary/50 shadow-none shadow-secondary/70 hover:shadow-2xl",
                    "after:bg-radial-[at_20%_20%] after:from-transparent after:to-primary/20 after:inset-0 after:w-full after:h-full after:absolute after:opacity-0 after:-z-1 after:transition-opacity hover:after:opacity-100",
                    "hover:bg-primary-50 dark:hover:bg-secondary/50"
                )}
            >
                <div className="flex items-center gap-4 justify-between">
                    <div className="flex flex-col items-start gap-3">
                        <div>
                            <span className="font-bold text-lg tracking-tight group-hover:text-primary dark:group-hover:text-foreground transition-colors">{quizInfo?.title || 'Unnamed'}</span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-primary dark:text-muted-foreground font-semibold">
                            <div className="inline-flex gap-1 items-center px-2 py-1 bg-primary-500/10 dark:bg-primary/10 rounded-md">
                                <List size={14} />
                                <span>{quizInfo?.questionCount || 0} questions</span>
                            </div>
                            <div className="inline-flex gap-1 items-center px-2 py-1 bg-primary-500/10 dark:bg-primary/10 rounded-md">
                                <Clock size={14} />
                                <span>{dayjs(quizInfo?.createdAt).fromNow()}</span>
                            </div>
                        </div>
                    </div>
                    <div className="group-hover:opacity-100 group-hover:animate-slide-left-and-show-inf opacity-0 transition-all text-primary relative after:absolute after:inset-0 after:w-full after:bg-radial after:from-primary after:to-transparent after:-z-1 after:blur-2xl">
                        <ChevronsRight size={48} strokeWidth={2} />
                    </div>
                </div>
            </div>
        </Link>
    );
}