import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

interface RightPanelProps {
  selectedTab: string;
}

const RightPanel: React.FC<RightPanelProps> = ({ selectedTab }) => {
  const renderContent = () => {
    switch (selectedTab) {
      case 'Page Management':
        return (
          <div className="flex flex-col gap-4 p-4">
            <h3 className="text-lg font-semibold">Page Settings</h3>
            <div className="grid gap-2">
              <Label htmlFor="pageName">Page Name</Label>
              <Input id="pageName" placeholder="e.g., home" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pageRoute">Route</Label>
              <Input id="pageRoute" placeholder="/home" disabled />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pageType">Page Type</Label>
              <Select>
                <SelectTrigger id="pageType">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="page">Page</SelectItem>
                  <SelectItem value="subpage">Subpage</SelectItem>
                  <SelectItem value="dynamic">Dynamic</SelectItem>
                  <SelectItem value="catch-all">Catch-all</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="routeAccess">Route Access</Label>
              <Switch id="routeAccess" />
            </div>
            <p className="text-sm text-muted-foreground">Toggle for Public/Protected access.</p>
            {/* Add more page-specific controls here */}
          </div>
        );
      case 'Components':
      case 'Elements':
        return (
          <div className="flex flex-col gap-4 p-4">
            <h3 className="text-lg font-semibold">Component/Element Properties</h3>
            <p className="text-sm text-muted-foreground">Select an item on the canvas to edit its properties.</p>
            <Separator />
            <div className="grid gap-2">
              <Label htmlFor="padding">Padding (px)</Label>
              <Input id="padding" type="number" placeholder="16" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="margin">Margin (px)</Label>
              <Input id="margin" type="number" placeholder="0" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="width">Width (%)</Label>
              <Input id="width" type="number" placeholder="100" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="backgroundColor">Background Color</Label>
              <Input id="backgroundColor" type="text" placeholder="#ffffff" />
            </div>
            {/* Add more common styling controls here */}
          </div>
        );
      default:
        return (
          <div className="flex flex-col gap-4 p-4">
            <h3 className="text-lg font-semibold">{selectedTab} Settings</h3>
            <p className="text-muted-foreground">Content for the "{selectedTab}" tab will appear here.</p>
            {/* Add specific controls for other tabs in the future */}
          </div>
        );
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-card">
      {renderContent()}
    </div>
  );
};

export default RightPanel;