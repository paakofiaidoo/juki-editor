import React, { ReactNode } from 'react';

export const PanelHeader = ({ icon, title, children }: { icon: ReactNode, title: string, children?: ReactNode }) => (
  <div className="flex items-center justify-between p-2 border-b border-juki-dark-3 h-10 shrink-0">
    <div className="flex items-center gap-2 text-sm font-bold text-gray-300">
      {icon}
      <span>{title}</span>
    </div>
    <div>{children}</div>
  </div>
);