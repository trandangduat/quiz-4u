"use server"

import { auth } from "@/lib/auth";
import { SignOut } from "./signout-button";
import SignIn from "./signin-button";

export default async function UserInfo() {
    const session = await auth();
    if (!session?.user) {
        return <SignIn />
    }

    return (
        <>
            <div className="flex flex-col">
                <b>{session.user.name}</b>
                <p>{session.user.email}</p>
            </div>
            <SignOut />
        </>
    )
}