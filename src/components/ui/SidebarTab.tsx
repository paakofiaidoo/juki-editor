import React, { type ReactNode } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';
import { cn } from '@/lib/utils';

// FIX: Changed component to React.FC to resolve issues with the 'key' prop in maps.
export const SidebarTab: React.FC<{ icon: ReactNode, label: string, active: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <button
        onClick={onClick}
        className={cn(
          "flex items-center justify-center w-10 h-10 p-2 my-1 transition-colors duration-200 rounded-md",
          active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        )}
      >
        {icon}
      </button>
    </TooltipTrigger>
    <TooltipContent side="right">
      <p>{label}</p>
    </TooltipContent>
  </Tooltip>
);