import { auth } from "@/lib/auth";
import SignIn from "./signin-button";
import UserInfo from "./user-info";

export default async function NavBar() {
    const session = await auth();

    if (!session?.user) {
        return (
            <SignIn />
        );
    }

    return (
        <UserInfo username={session.user.name || "??"} email={session.user.email || "??"} />
    );
}