/**
 * Simple Select Component
 * 
 * Basic select implementation without external dependencies.
 */

import React, { useState, useRef, useEffect } from 'react';

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

interface SelectTriggerProps {
  className?: string;
  children: React.ReactNode;
  onClick: () => void;
}

interface SelectContentProps {
  className?: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

interface SelectItemProps {
  value: string;
  className?: string;
  children: React.ReactNode;
  onSelect: (value: string) => void;
}

export function Select({ value, onValueChange, children, className }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (selectedValue: string) => {
    onValueChange(selectedValue);
    setIsOpen(false);
  };

  return (
    <div ref={selectRef} className={className}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            isOpen,
            setIsOpen,
            onSelect: handleSelect,
            currentValue: value,
            ...(child.props as any)
          });
        }
        return child;
      })}
    </div>
  );
}

export function SelectTrigger({ className, children, onClick, isOpen, setIsOpen, currentValue }: any) {
  const selectedChild = React.Children.toArray(children).find(
    (child): child is React.ReactElement<any> => 
      React.isValidElement(child) && 'value' in child.props && child.props.value === currentValue
  );

  return (
    <button
      ref={useRef<HTMLButtonElement>(null)}
      className={`flex h-10 w-full items-center justify-between rounded-md border  bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 ${className}`}
      onClick={() => setIsOpen?.(!isOpen)}
    >
      <span>{selectedChild?.props?.children || currentValue}</span>
      <svg className="h-4 w-4 opacity-50 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
}

export function SelectContent({ className, children, isOpen, onClose, onSelect, currentValue }: any) {
  if (!isOpen) return null;

  return (
    <div className={`absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-gray-800 text-white shadow-md ${className}`}>
      <div className="p-1">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              onSelect,
              currentValue,
              ...(child.props as any)
            });
          }
          return child;
        })}
      </div>
    </div>
  );
}

export function SelectItem({ value, className, children, onSelect, currentValue }: any) {
  const isSelected = value === currentValue;

  return (
    <div
      className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:font-bold focus:bg-gray-700 text-white ${isSelected ? 'bg-gray-700' : ''} ${className}`}
      onClick={() => onSelect?.(value)}
    >
      {isSelected && (
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </span>
      )}
      {children}
    </div>
  );
}

export function SelectValue({ children }: { children: React.ReactNode }) {
  return <span>{children}</span>;
}
