/**
 * Simple Tabs Component
 * 
 * Basic tabs implementation without external dependencies.
 */

import React, { useState } from 'react';

interface TabsProps {
  defaultValue: string;
  className?: string;
  children: React.ReactNode;
}

interface TabsListProps {
  className?: string;
  children: React.ReactNode;
}

interface TabsTriggerProps {
  value: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

interface TabsContentProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

export function Tabs({ defaultValue, className, children }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  const childrenWithProps = React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { 
            activeTab, 
            setActiveTab,
            ...(child.props as any)
          });
        }
        return child;
      });

  return (
    <div className={className}>
      {childrenWithProps}
    </div>
  );
}

export function TabsList({ className, children, activeTab, setActiveTab }: any) {
  return (
    <div className={`inline-flex h-10 items-center justify-center rounded-md bg-gray-800 p-1 text-gray-400 ${className}`}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && 'value' in (child.props as Record<string, unknown>)) {
          const childProps = child.props as Record<string, unknown> & { value: string };
          return React.cloneElement(child, { 
            activeTab, 
            setActiveTab,
            isActive: childProps.value === activeTab,
            ...(child.props as any)
          });
        }
        return child;
      })}
    </div>
  );
}

export function TabsTrigger({ value, className, children, activeTab, setActiveTab, isActive }: any) {
  return (
    <button
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-gray-300 hover:text-secondary ${
        isActive ? 'bg-primary text-secondary text-bold shadow-sm' : ''
      } ${className}`}
      onClick={() => setActiveTab?.(value)}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, className, children, activeTab }: any) {
  if (activeTab !== value) return null;
  
  return (
    <div className={`mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className}`}>
      {children}
    </div>
  );
}
