import { cn } from "@/lib/utils";

export function Canvas({ className }: React.ComponentProps<"div">) {
  const isEmpty = true; // Placeholder for checking if there are components on the canvas

  return (
    <div
      className={cn(
        "relative h-full w-full overflow-auto border-2 border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900",
        className
      )}
    >
      {isEmpty ? (
        <div className="flex h-full items-center justify-center text-center text-muted-foreground">
          <p>Drag components and elements here to build your page.</p>
        </div>
      ) : (
        {
          /* Placeholder for rendered components */
        }
      )}
    </div>
  );
}