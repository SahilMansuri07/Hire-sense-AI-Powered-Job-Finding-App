import { cn } from "./utils";
const Skeleton = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
      ref={ref}
    />
  );
});
Skeleton.displayName = "Skeleton";
export { Skeleton };
