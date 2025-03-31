import { cn } from "@/lib/utils";
import ToggleThemeButton from "./toggle-theme-button";
import UserInfo from "./user-info";
import Link from "next/link";
import React from "react";

const links = [
    { title: "Home", link: "/" },
    { title: "My quizzes", link: "/quiz" },
];

interface NavBarItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
    className?: string;
}

function NavBarItem({ className, children, ...props }: NavBarItemProps) {
    return (
        <li className={cn("relative", className)} {...props}>
            {children}
        </li>
    );
}

interface NavBarGroupProps extends React.HTMLAttributes<HTMLUListElement> {
    className?: string;
}

function NavBarGroup({ className, children, ...props }: NavBarGroupProps) {
    return (
        <ul className={cn("flex flex-row gap-2 items-center", className)} {...props}>
            {children}
        </ul>
    );
}

export default function NavBar() {
    return (
        <nav className="flex flex-row justify-between p-4 text-sm font-bold items-center">
            <NavBarGroup>
                {links.map((item) => (
                    <NavBarItem key={item.link}>
                        <Link 
                            href={item.link} 
                            className="px-3 py-2 rounded-md transition-colors text-slate-800 dark:text-slate-400 hover:bg-secondary/50 hover:text-slate-900 dark:hover:text-white"
                        >
                            {item.title}
                        </Link>
                    </NavBarItem>
                ))}
            </NavBarGroup>
            <NavBarGroup>
                <NavBarItem>
                    <ToggleThemeButton 
                        className="px-3 py-2 rounded-md cursor-pointer transition-colors text-slate-800 dark:text-slate-400 hover:bg-secondary/50 hover:text-slate-900 dark:hover:text-white"
                    />
                </NavBarItem>
                <NavBarItem>
                    <UserInfo />
                </NavBarItem>
            </NavBarGroup>
        </nav>
    );
}
