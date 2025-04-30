import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Manrope, Montserrat } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { CurrentAttemptProvider } from "@/components/providers/current-attempt";
import CurrentAttemptToast from "@/components/current-attempt-toast";
import { manrope } from "./font";

export const metadata: Metadata = {
  title: "QUIZ4U",
  description: "LLM Quiz Generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${manrope.className} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <CurrentAttemptProvider>
            <NavBar />
            <CurrentAttemptToast />
            {children}
          </CurrentAttemptProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
