import { auth } from "@/lib/auth";
import SignIn from "./signin-button";
import UserInfo from "./user-info";
import Link from "next/link";

export default async function NavBar() {
    const session = await auth();

    if (!session?.user) {
        return (
            <SignIn />
        );
    }

    return (
        <div className="bg-zinc-900 flex flex-row gap-8">
            <UserInfo username={session.user.name || "??"} email={session.user.email || "??"} />
            <Link href="/quiz">My quizzes</Link>
            <Link href="/">Home</Link>
        </div>
    );
}