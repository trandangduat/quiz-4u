import { cn } from "@/lib/utils";
import { Upload } from "lucide-react";
import { Playfair_Display } from "next/font/google";
import React from "react";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
});

type FileInputProps = {
  className?: string;
};

export const FileInput = ({ className, ...props }: FileInputProps & React.ComponentProps<"input">) => {
  return (
    <div
      className={cn(
        "w-full relative text-center",
        className
      )}>
      <input
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-0"
        type="file"
        accept={props.accept}
        multiple={props.multiple}
        onChange={props.onChange}
        ref={props.ref}
      />
      <div
        className="w-full flex flex-col justify-center items-center"
      >
        <FileInputSymbol />
        <p className={cn("text-3xl dark:text-slate-400 mt-6", playfairDisplay.className)}>
          Upload or drag <span className="">documents</span> 
        </p>
        <p className="text-base dark:text-slate-400 mt-2">
          to start generating quizzes
        </p>
      </div>
    </div>
  );
}

const FileInputSymbol = () => {
  return (
    <div className="">
      <Upload size={64} className="dark:text-slate-400" />
    </div>
  )
}