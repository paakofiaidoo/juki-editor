import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarSectionProps {
    title: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

export const SidebarSection = ({ title, icon, children, defaultOpen = false }: SidebarSectionProps) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-border/50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn("flex items-center w-full px-4 py-3 text-sm font-medium transition-colors hover:bg-muted/50", isOpen ? "text-foreground" : "text-muted-foreground")}
            >
                <span className="mr-2 opacity-70">{icon}</span>
                <span className="flex-1 text-left">{title}</span>
                {isOpen ? <ChevronDown size={14} className="opacity-50" /> : <ChevronRight size={14} className="opacity-50" />}
            </button>
            {isOpen && <div className="px-4 py-2 bg-muted/10">{children}</div>}
        </div>
    );
};
