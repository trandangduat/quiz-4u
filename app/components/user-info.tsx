import { signOut } from "next-auth/react";

export default function UserInfo({ username, email } : {username: string, email: string}) {
    return (
        <>
            <div className="flex flex-col">
                <b>{username}</b>
                <p>{email}</p>
            </div>
            <button onClick={() => signOut()} className="bg-red-700 p-2 rounded-md">Sign out</button>
        </>
    )
}