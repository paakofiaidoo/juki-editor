import React, { ReactNode } from 'react';

// FIX: Changed component to React.FC to resolve issues with the 'key' prop in maps.
export const SidebarTab: React.FC<{ icon: ReactNode, label: string, active: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    title={label}
    className={`flex items-center justify-center w-full p-3 my-1 transition-colors duration-200 ${
      active ? 'bg-juki-green text-black' : 'text-gray-400 hover:bg-juki-dark-3 hover:text-white'
    }`}
  >
    {icon}
  </button>
);