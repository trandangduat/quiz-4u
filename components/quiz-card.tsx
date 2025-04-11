import { ClipboardList } from "lucide-react";
import Link from "next/link";

export default function QuizCard({ quizLink, quizInfo } : { quizLink: string, quizInfo: { title: string, questionCount: number } }) {
    return (
        <Link href={quizLink}>
            <div 
                className="
                    bg-linear-to-br from-secondary-100/50 to-secondary-200 border-2 border-secondary rounded-md py-4 px-6
                    group hover:bg-secondary-200 hover:scale-105 hover:border-secondary-300
                    transition-all duration-200 ease-in-out
                ">
                <div className="flex items-center gap-4">
                    <div className="bg-secondary-400/50 group-hover:bg-secondary-300 transition-colors rounded-full p-4">
                    <ClipboardList size={32} strokeWidth={1.25} />
                    </div>
                    <div className="flex flex-col items-start gap-1">
                    <div>
                        <span className="font-bold text-primary-800 transition-colors group-hover:text-primary-900">{quizInfo?.title || 'Quiz Generated'}</span>
                    </div>
                    <div className="bg-secondary-200 text-primary-800 px-3 py-0.5 rounded-md inline-block text-[12px]">
                        <span>{quizInfo?.questionCount || 0} questions</span>
                    </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}