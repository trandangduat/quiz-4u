"use client"

import { cn } from '@/lib/utils';
import React, { createContext, useContext, useState, ReactNode } from 'react';

type DropdownContextType = {
  isOpen: boolean;
  toggle: () => void;
};

const DropdownContext = createContext<DropdownContextType | undefined>(undefined);

const useDropdown = () => {
  const context = useContext(DropdownContext);
  if (!context) throw new Error("Dropdown compound components must be used within Dropdown");
  return context;
};

type DropdownProps = {
  children: ReactNode;
  className?: string
};

export const Dropdown = ({ children, className }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(prev => !prev);
  
  return (
    <DropdownContext.Provider value={{ isOpen, toggle }}>
      <div className={cn("relative", className)}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
};

type DropdownTriggerProps = {
  children: ReactNode;
  className?: string;
};

export const DropdownTrigger = ({ children, className }: DropdownTriggerProps) => {
  const { toggle } = useDropdown();
  return (
    <div onClick={toggle} className={cn(className)}>
      {children}
    </div>
  );
};

type DropdownContentProps = {
  children: ReactNode;
  className?: string;
};

export const DropdownContent = ({ children, className }: DropdownContentProps) => {
  const { isOpen } = useDropdown();
  if (!isOpen) return null;
  return (
    <div className={cn("absolute mt-2 right-0 bg-background text-foreground border rounded-md", className)}>
      {children}
    </div>
  );
};

export const DropdownSeparator = () => {
  return (
    <div className="border-t my-2" />
  );
};

// Compound assignment for convenient usage
Dropdown.Trigger = DropdownTrigger;
Dropdown.Content = DropdownContent;
Dropdown.Separator = DropdownSeparator;
