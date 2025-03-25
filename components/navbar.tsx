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
        <li className={cn(className)} {...props}>
            {children}
        </li>
    );
}

interface NavBarGroupProps extends React.HTMLAttributes<HTMLUListElement> {
    className?: string;
}

function NavBarGroup({ className, children, ...props }: NavBarGroupProps) {
    return (
        <ul className={cn(className)} {...props}>
            {children}
        </ul>
    );
}

export default function NavBar() {
    return (
        <nav className="flex flex-row gap-8 justify-center">
            <NavBarGroup>
                {links.map((item) => (
                    <NavBarItem key={item.link}>
                        <Link href={item.link}>{item.title}</Link>
                    </NavBarItem>
                ))}
            </NavBarGroup>
            <NavBarGroup>
                <ToggleThemeButton />
                <UserInfo />
            </NavBarGroup>
        </nav>
    );
}
