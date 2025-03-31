"use client"

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ToggleThemeButton( { className }: { className?: string }) {
    const { theme, setTheme } = useTheme();

    return (
        <button
            className={cn(className)}
            onClick={() => {
                setTheme(theme == "dark" ? "light" : "dark");
            }}
        >
            <div className="grid grid-cols-1">
                <Sun 
                    size={20} 
                    className="col-start-1 row-start-1 transition-transform duration-400 dark:scale-100 dark:rotate-0 scale-0 rotate-90" 
                />
                <Moon 
                    size={20} 
                    className="col-start-1 row-start-1 transition-transform duration-400 dark:scale-0 dark:-rotate-90 scale-100 rotate-0" 
                />
            </div>
        </button>
    );
}