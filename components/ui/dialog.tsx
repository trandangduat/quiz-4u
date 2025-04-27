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
        "fixed inset-0 z-50 flex items-center justify-center bg-black/80 transition-all duration-200",
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
        "bg-card dark:bg-secondary-100/60 border-1 backdrop-blur-xl w-full max-w-lg rounded-md p-6 flex flex-col gap-4 transition-all duration-200",
        open ? "scale-100 opacity-100" : "scale-90 opacity-0",
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
    <div className={cn("flex flex-row justify-between items-center gap-4 p-4 rounded-md bg-secondary/20", className)}>
      <div className="space-y-1.5 flex flex-col">
        {title && <span className="text-lg leading-none font-bold tracking-tight">{title}</span>}
        {description && <span className="text-sm text-muted-foreground">{description}</span>}
      </div>
      <div>
        <X size={16} className="cursor-pointer opacity-50 transition-all hover:opacity-100" onClick={() => setOpen(false)} />
      </div>
    </div>
  );
}