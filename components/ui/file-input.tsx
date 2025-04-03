import { cn } from "@/lib/utils";
import React from "react";

type FileInputProps = {
  className?: string;
};

export const FileInput = ({ className, ...props }: FileInputProps & React.ComponentProps<"input">) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center w-full relative text-center",
        className
      )}>
      <input
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        type="file"
        accept={props.accept}
        multiple={props.multiple}
        onChange={props.onChange}
        ref={props.ref}
      />
      <div
        className="w-full p-4 border-2 border-dashed rounded-2xl"
      >
        <p className="text-2xl font-bold">Upload or drag <span className="text-primary-800">files</span> to start generating quiz</p>
      </div>
    </div>
  );
}
