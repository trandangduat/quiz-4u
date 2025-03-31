"use server"

import { auth } from "@/lib/auth";
import { SignOut } from "./signout-button";
import SignIn from "./signin-button";
import { cn } from "@/lib/utils";
import { Dropdown, DropdownContent, DropdownSeparator, DropdownTrigger } from "./ui/dropdown";

export default async function UserInfo({ className }: { className?: string }) {
    const session = await auth();
    if (!session?.user) {
        return <SignIn />
    }

    return (
        <div className={cn(className)}>
            <Dropdown>
                <DropdownTrigger className="cursor-pointer">
                    <div className="w-8 h-8 rounded-full overflow-clip">
                        <img src={session.user.image!} />
                    </div>
                </DropdownTrigger>
                <DropdownContent className="p-3 transition-transform duration-200 origin-top-right scale-100">
                    <div className="p-2 flex gap-4">
                        <div className="rounded-sm overflow-clip w-10 aspect-square">
                            <img src={session.user.image!} className="w-full h-full" />
                        </div>
                        <div className="">
                            <p className="text-base font-medium">{session.user.name}</p>
                            <p className="font-normal">{session.user.email}</p>
                        </div>
                    </div>
                    <DropdownSeparator />
                    <SignOut 
                        className="w-full"
                    />
                </DropdownContent>
            </Dropdown>
        </div>
    )
}