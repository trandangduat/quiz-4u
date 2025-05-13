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
    const quizInfoStyle = "flex items-center font-semibold justify-between w-full";

    return (
        <Link href={quizLink}>
            <div
                className={cn(
                    "group bg-card/50 dark:bg-secondary/25 rounded-md p-6 h-full relative border-2 border-transparent hover:border-primary/50 shadow-none shadow-secondary/70 hover:shadow-2xl",
                    "hover:bg-primary hover:text-background"
                )}
            >
                <div className="relative h-full">
                    <div className="flex flex-col items-start gap-4 justify-between h-full">
                        <div className="w-full">
                            <p className="font-extrabold text-xl tracking-tight w-full group-hover:text-white dark:group-hover:text-background">
                                {quizInfo?.title || 'Unnamed'}
                            </p>
                        </div>
                        <div className="flex flex-col flex-wrap gap-2 w-full text-sm">
                            <div className={quizInfoStyle}>
                                <div className="flex items-center gap-2 text-muted-foreground group-hover:text-secondary">
                                    <List size={14} />
                                    <span>Questions</span>
                                </div>
                                <span>{quizInfo?.questionCount || 0}</span>
                            </div>
                            <div className={quizInfoStyle}>
                                <div className="flex items-center gap-2 text-muted-foreground group-hover:text-secondary">
                                    <Clock size={14} />
                                    <span>Created</span>
                                </div>
                                <span>{dayjs(quizInfo?.createdAt).fromNow()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
