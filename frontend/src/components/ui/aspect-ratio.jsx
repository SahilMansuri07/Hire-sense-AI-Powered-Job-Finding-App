"use client";

import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";
const AspectRatio = React.forwardRef(({ ...props }, ref) => {
  return (
    <AspectRatioPrimitive.Root data-slot="aspect-ratio" {...props} ref={ref} />
  );
});
AspectRatio.displayName = "AspectRatio";
export { AspectRatio };
