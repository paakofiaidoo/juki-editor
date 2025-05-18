import { useState } from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LeftSideBarProps extends React.ComponentProps<"div"> {
  onTabChange: (tab: string) => void;
}

export function LeftSideBar({ onTabChange, className, ...props }: LeftSideBarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('Page Management');

  const tabs = [
    { id: 'Page Management', label: 'Pages', icon: '📄' },
    { id: 'Components', label: 'Components', icon: '🧱' },
    { id: 'Elements', label: 'Elements', icon: '🔤' },
    { id: 'Modules', label: 'Modules', icon: '🧩' },
    { id: 'Marketplace', label: 'Marketplace', icon: '🧑‍🎨' },
    { id: 'Theme', label: 'Theme', icon: '🎨' },
    { id: 'Icons', label: 'Icons', icon: '🧷' },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange(tabId);
  };

  return (
    <div className={cn("flex h-full", className)} {...props}>
      <div
        className={cn(
          "flex h-full flex-col overflow-hidden transition-all duration-300",
          isCollapsed ? "w-14" : "w-48"
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          className="mb-2 w-full"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? '▶' : '◀'}
        </Button>
        <ScrollArea className="flex-grow">
          <nav className="grid gap-1 px-2">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "secondary" : "ghost"}
                className={cn(
                  "justify-start",
                  isCollapsed ? "flex justify-center" : ""
                )}
                onClick={() => handleTabClick(tab.id)}
              >
                <span className={cn("mr-2", isCollapsed ? "mr-0 text-xl" : "text-base")}>
                  {tab.icon}
                </span>
                {!isCollapsed && tab.label}
              </Button>
            ))}
          </nav>
        </ScrollArea>
      </div>
      {!isCollapsed && (
        <ScrollArea className="flex-grow border-l p-2">
          {activeTab === 'Page Management' && (
            <div>
              <h3 className="mb-2 text-lg font-semibold">Pages</h3>
              {/* Page management controls will go here */}
              <p className="text-sm text-muted-foreground">Manage your pages.</p>
            </div>
          )}
          {activeTab === 'Components' && (
            <div>
              <h3 className="mb-2 text-lg font-semibold">Components</h3>
              {['Button', 'Card', 'Input'].map(component => (
                <div key={component} className="flex items-center justify-between p-2 hover:bg-muted cursor-grab rounded-md">
                  <span>{component}</span> [Drag]
                </div>
              ))}
            </div>
          )}
          {activeTab === 'Elements' && (
            <div>
              <h3 className="mb-2 text-lg font-semibold">Elements</h3>
              {['div', 'h1', 'p', 'img'].map(element => (
                <div key={element} className="flex items-center justify-between p-2 hover:bg-muted cursor-grab rounded-md">
                  <span>{element}</span> [Drag]
                </div>
              ))}
            </div>
          )}
          {activeTab === 'Modules' && (
            <div>
              <h3 className="mb-2 text-lg font-semibold">Modules</h3>
              {/* Module list will go here */}
              <p className="text-sm text-muted-foreground">Browse and add modules.</p>
            </div>
          )}
          {activeTab === 'Marketplace' && (
            <div>
              <h3 className="mb-2 text-lg font-semibold">Marketplace</h3>
              {/* Marketplace content will go here */}
              <p className="text-sm text-muted-foreground">Discover and import items.</p>
            </div>
          )}
          {activeTab === 'Theme' && (
            <div>
              <h3 className="mb-2 text-lg font-semibold">Theme</h3>
              {/* Theme settings will go here */}
              <p className="text-sm text-muted-foreground">Customize your theme.</p>
            </div>
          )}
          {activeTab === 'Icons' && (
            <div>
              <h3 className="mb-2 text-lg font-semibold">Icons</h3>
              {/* Icon search/list will go here */}
              <p className="text-sm text-muted-foreground">Search and use icons.</p>
            </div>
          )}
        </ScrollArea>
      )}
    </div>
  );
}