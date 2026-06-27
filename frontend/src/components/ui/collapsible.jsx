"use client";

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
const Collapsible = React.forwardRef(({ ...props }, ref) => {
  return (
    <CollapsiblePrimitive.Root data-slot="collapsible" {...props} ref={ref} />
  );
});
Collapsible.displayName = "Collapsible";
const CollapsibleTrigger = React.forwardRef(({ ...props }, ref) => {
  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      data-slot="collapsible-trigger"
      {...props}
      ref={ref}
    />
  );
});
CollapsibleTrigger.displayName = "CollapsibleTrigger";
const CollapsibleContent = React.forwardRef(({ ...props }, ref) => {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      data-slot="collapsible-content"
      {...props}
      ref={ref}
    />
  );
});
CollapsibleContent.displayName = "CollapsibleContent";
export { Collapsible, CollapsibleTrigger, CollapsibleContent };
