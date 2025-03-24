"use client"

import { useTheme } from "next-themes";

export default function ToggleThemeButton() {
    const { theme, setTheme } = useTheme();

    return (
        <button
            onClick={() => {
                setTheme(theme == "dark" ? "light" : "dark");
            }}
        >
            Toggle theme
        </button>
    );
}