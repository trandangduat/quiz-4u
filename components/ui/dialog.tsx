"use client"

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { createContext, useContext, useState } from "react";

type DialogProps = {
  children: React.ReactNode;
  className?: string;
};

const DialogContext = createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>({
  open: false,
  setOpen: (open: boolean) => {}
});

export const Dialog = ({ children, className }: DialogProps) => {
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
  const { open } = useContext(DialogContext);

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-all",
      open ? "visible" : "invisible",
      className
    )}>
      <div className={cn("bg-card dark:bg-secondary/25 rounded-md p-6 flex flex-col gap-6", className)}>
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
      <div className="flex flex-col">
        {title && <span className="text-lg font-semibold">{title}</span>}
        {description && <span className="text-sm text-muted-foreground">{description}</span>}
      </div>
      <div>
        <X size={16} className="cursor-pointer" onClick={() => setOpen(false)} />
      </div>
    </div>
  );
}