import { cn } from "@/lib/utils";
import { FileTypeIcon, Upload } from "lucide-react";
import { Geist_Mono, Playfair_Display } from "next/font/google";
import React from "react";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
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
        <p className={cn("text-3xl dark:text-slate-400 mt-6")}>
          Upload or drag <span className="">documents</span> 
        </p>
        <p className={cn("text-base dark:text-slate-400 mt-2")}>
          Maximum 5MB per file
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

type FileInputListProps = {
  className?: string;
  filesName?: string[];
  filesType?: string[];
  filesSize?: number[];
  hasFiles?: boolean;
};

export const FileInputList = ({className, filesName, filesType, filesSize, hasFiles} : FileInputListProps) => {
  return (
    <ul className = {cn("flex flex-col dark:bg-slate-800/20 rounded-xl p-6 space-y-3", className, hasFiles ? "" : "hidden")}>
      {filesName!.map((name, index) => (
        <li key={index} className={cn("flex items-center justify-between text-sm", geistMono.className)}>
          <p className={cn("dark:text-slate-400")}>
            {name.slice(0, 30) + (name.length > 30 ? "..." : "")}
          </p>
          <p className={cn("dark:text-slate-400")}>
            {(filesSize![index] / 1024 / 1024).toFixed(2)} MB
          </p>
        </li>
      ))}
    </ul>
  );
}