"use client";

import React, { useState, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
}

export interface CustomTabsProps {
  tabs: TabItem[];
  defaultTab?: string;
  children: ReactNode;
  className?: string;
}

export function CustomTabs({ tabs, defaultTab, children, className }: CustomTabsProps) {
  // Validate the tabs prop to prevent errors
  if (!tabs || !Array.isArray(tabs) || tabs.length === 0) {
    console.error("Tabs component requires a non-empty tabs array");
    return <div className="text-red-500">Error: Invalid tabs configuration</div>;
  }

  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0].id);

  // Find all the children with IDs that match tab IDs
  const childrenArray = Array.isArray(children) ? children : [children];
  
  // Filter only children that are for the active tab
  const activeChild = React.Children.toArray(childrenArray).find(
    (child) => React.isValidElement(child) && child.props.id === activeTab
  );

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex space-x-1 rounded-lg bg-muted p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-all",
              activeTab === tab.id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="rounded-md bg-card p-4 shadow-sm">
        {activeChild}
      </div>
    </div>
  );
} 