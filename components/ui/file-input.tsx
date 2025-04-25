import { cn } from "@/lib/utils";
import { Upload } from "lucide-react";
import React from "react";

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
        <p className={cn("text-2xl mt-6 font-semibold")}>
          Upload or drag <span className="">documents</span>
        </p>
        <p className={cn("text-sm dark:text-primary-900/70 mt-1")}>
          Maximum 5MB per file
        </p>
      </div>
    </div>
  );
}

const FileInputSymbol = () => {
  return (
    <div className="">
      <Upload size={64} className="dark:text-primary-900" />
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

// helper function to format file size
const formatFileSize = (bytes?: number): string => {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024;
    i++;
  }
  return `${bytes.toFixed(1)} ${units[i]}`;
};

const FileTypeIcons = {
  Default: ({ className }: { className?: string }) => (
    <svg className={cn("text-slate-400", className)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="2" width="18" height="20" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M7 7h10M7 12h10M7 17h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  Image: ({ className }: { className?: string }) => (
    <svg className={cn("text-blue-400", className)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="2" width="18" height="20" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M6 16l3-3 2 2 4-4 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
    </svg>
  ),
  PDF: ({ className }: { className?: string }) => (
    <svg className={cn("text-red-400", className)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="2" width="18" height="20" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
      <text x="12" y="13" fontSize="5" fontWeight="bold" fill="currentColor" textAnchor="middle" dominantBaseline="middle">PDF</text>
    </svg>
  ),
  Word: ({ className }: { className?: string }) => (
    <svg className={cn("text-indigo-400", className)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="2" width="18" height="20" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
      <text x="12" y="13" fontSize="5" fontWeight="bold" fill="currentColor" textAnchor="middle" dominantBaseline="middle">DOC</text>
    </svg>
  ),
  Excel: ({ className }: { className?: string }) => (
    <svg className={cn("text-green-400", className)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="2" width="18" height="20" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
      <text x="12" y="13" fontSize="5" fontWeight="bold" fill="currentColor" textAnchor="middle" dominantBaseline="middle">XLS</text>
    </svg>
  ),
};

const getFileIcon = (fileType?: string, size?:string) => {
  if (!fileType) return <FileTypeIcons.Default className={size} />;

  if (fileType.includes('image')) return <FileTypeIcons.Image className={size} />;
  if (fileType.includes('pdf')) return <FileTypeIcons.PDF className={size} />;
  if (fileType.includes('word') || fileType.includes('document')) return <FileTypeIcons.Word className={size} />;
  if (fileType.includes('excel') || fileType.includes('spreadsheet')) return <FileTypeIcons.Excel className={size} />;

  return <FileTypeIcons.Default className={size} />;
};

export const FileInputList = ({className, filesName = [], filesType = [], filesSize = [], hasFiles} : FileInputListProps) => {
  if (!hasFiles || filesName.length === 0) return null;

  return (
    <div className={cn("w-full mx-auto mt-4", className)}>
      <div className="bg-secondary/20 rounded-xl p-6">
        <h3 className="text-sm font-medium mb-3">Uploaded Files</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filesName.map((name, index) => (
            <div
              key={index}
              className="flex flex-row gap-2 overflow-hidden bg-gray-100 dark:bg-secondary/40 p-3 rounded-lg hover:bg-card dark:hover:bg-secondary/70 shadow-sm"
            >
              <div className="flex-shrink-0 w-10">
                {getFileIcon(filesType[index], "h-10 w-10")}
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span
                  className={cn(
                    "text-sm block font-semibold break-all line-clamp-2"
                  )}
                  title={name} // Show full name on hover
                >
                  {name}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {formatFileSize(filesSize[index])}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}