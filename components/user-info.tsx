import { SignOut } from "./signout-button";

export default function UserInfo({ username, email } : {username: string, email: string}) {
    return (
        <>
            <div className="flex flex-col">
                <b>{username}</b>
                <p>{email}</p>
            </div>
            <SignOut />
        </>
    )
}