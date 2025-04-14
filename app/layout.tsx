import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { CurrentAttemptProvider } from "@/components/providers/current-attempt";
import CurrentAttemptToast from "@/components/current-attempt-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const monstserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

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
        className={`${monstserrat.className} ${geistMono.variable} antialiased`}
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
