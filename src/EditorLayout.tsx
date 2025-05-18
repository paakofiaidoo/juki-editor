import {
  ResizablePanelGroup,
  ResizablePanel
} from "@/components/ui/resizable";
import {
  Separator
} from "@/components/ui/separator"

export function EditorLayout() {
 return (
 <ResizablePanelGroup direction="horizontal" className="h-screen w-full">
 <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
 <div className="flex h-full items-center justify-center p-6">
 Left Sidebar
 {/* Component Library, Page Management, etc. */}
 </div>
 </ResizablePanel>
 <Separator orientation="vertical" />
 <ResizablePanel defaultSize={60} minSize={30}>
 <ResizablePanelGroup direction="vertical">
 <ResizablePanel defaultSize={75} minSize={40}>
 <div className="flex h-full items-center justify-center p-6">
 Canvas Area
 {/* Drag and drop builder area */}
 </div>
 </ResizablePanel>
 <Separator orientation="horizontal" />
 <ResizablePanel defaultSize={25} minSize={20}>
 <div className="flex h-full items-center justify-center p-6">
 Code Preview
 {/* Real-time generated code */}
 </div>
 </ResizablePanel>
 </ResizablePanelGroup>
 </ResizablePanel>
 <Separator orientation="vertical" />
 <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
 <div className="flex h-full items-center justify-center p-6">
 Right Panel
 {/* Contextual Controls Panel */}
            </div>
          </ResizablePanel>
 </ResizablePanelGroup>
 );
}