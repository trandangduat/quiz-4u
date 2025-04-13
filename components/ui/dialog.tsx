"use client"

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { createContext, useContext, useRef, useState } from "react";

type DialogProps = {
  children: React.ReactNode;
};

const DialogContext = createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>({
  open: false,
  setOpen: (open: boolean) => {}
});

export const Dialog = ({ children }: DialogProps) => {
  const [open, setOpen] = useState(false);

  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
}

export const DialogTrigger = ({ children }: { children: React.ReactNode }) => {
  const { setOpen } = useContext(DialogContext);

  return (
    <div onClick={() => setOpen(true)}>
      {children}
    </div>
  );
}

type DialogContentProps = {
  children: React.ReactNode;
  className?: string;
};

export const DialogContent = ({ children, className }: DialogContentProps) => {
  const { open, setOpen } = useContext(DialogContext);
  const dialogContentRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-all duration-200",
        open ? "opacity-100" : "opacity-0 pointer-events-none",
        className
      )}
      ref={dialogContentRef}
      onMouseDown={(e) => {
        if (dialogContentRef.current && dialogContentRef.current === (e.target as Node)) {
          setOpen(false);
        }
      }}
    >
      <div className={cn(
        "bg-card dark:bg-secondary/25 w-full max-w-md rounded-md p-6 flex flex-col gap-6 transition-all duration-200",
        open ? "scale-100 opacity-100" : "scale-95 opacity-0",
        className
      )}>
        {children}
      </div>
    </div>
  );
}

type DialogHeaderProps = {
  title?: string;
  description?: string;
  className?: string;
};

export const DialogHeader = ({ className, title, description }: DialogHeaderProps) => {
  const { setOpen } = useContext(DialogContext);

  return (
    <div className={cn("flex flex-row justify-between items-center gap-4", className)}>
      <div className="flex flex-col gap-1">
        {title && <span className="text-lg font-semibold">{title}</span>}
        {description && <span className="text-sm text-foreground/90">{description}</span>}
      </div>
      <div>
        <X size={16} className="cursor-pointer opacity-75 hover:opacity-100" onClick={() => setOpen(false)} />
      </div>
    </div>
  );
}