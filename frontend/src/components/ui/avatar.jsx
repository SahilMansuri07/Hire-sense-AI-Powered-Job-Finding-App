"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "./utils";
const Avatar = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-10 shrink-0 overflow-hidden rounded-full",
        className,
      )}
      {...props}
      ref={ref}
    />
  );
});
Avatar.displayName = "Avatar";
const AvatarImage = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
      ref={ref}
    />
  );
});
AvatarImage.displayName = "AvatarImage";
const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className,
      )}
      {...props}
      ref={ref}
    />
  );
});
AvatarFallback.displayName = "AvatarFallback";
export { Avatar, AvatarImage, AvatarFallback };
