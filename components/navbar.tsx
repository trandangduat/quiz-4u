import ToggleThemeButton from "./toggle-theme-button";
import UserInfo from "./user-info";
import Link from "next/link";

export default async function NavBar() {
    return (
        <div className="flex flex-row gap-8 justify-center">
            <UserInfo />
            <Link href="/quiz">My quizzes</Link>
            <Link href="/">Home</Link>
            <ToggleThemeButton />
        </div>
    );
}