"use client";

import * as React from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";
import { cn } from "./utils";
const Menubar = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <MenubarPrimitive.Root
      data-slot="menubar"
      className={cn(
        "bg-background flex h-9 items-center gap-1 rounded-md border p-1 shadow-xs",
        className,
      )}
      {...props}
      ref={ref}
    />
  );
});
Menubar.displayName = "Menubar";
const MenubarMenu = React.forwardRef(({ ...props }, ref) => {
  return (
    <MenubarPrimitive.Menu data-slot="menubar-menu" {...props} ref={ref} />
  );
});
MenubarMenu.displayName = "MenubarMenu";
const MenubarGroup = React.forwardRef(({ ...props }, ref) => {
  return (
    <MenubarPrimitive.Group data-slot="menubar-group" {...props} ref={ref} />
  );
});
MenubarGroup.displayName = "MenubarGroup";
const MenubarPortal = React.forwardRef(({ ...props }, ref) => {
  return (
    <MenubarPrimitive.Portal data-slot="menubar-portal" {...props} ref={ref} />
  );
});
MenubarPortal.displayName = "MenubarPortal";
const MenubarRadioGroup = React.forwardRef(({ ...props }, ref) => {
  return (
    <MenubarPrimitive.RadioGroup
      data-slot="menubar-radio-group"
      {...props}
      ref={ref}
    />
  );
});
MenubarRadioGroup.displayName = "MenubarRadioGroup";
const MenubarTrigger = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <MenubarPrimitive.Trigger
      data-slot="menubar-trigger"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex items-center rounded-sm px-2 py-1 text-sm font-medium outline-hidden select-none",
        className,
      )}
      {...props}
      ref={ref}
    />
  );
});
MenubarTrigger.displayName = "MenubarTrigger";
const MenubarContent = React.forwardRef(
  (
    { className, align = "start", alignOffset = -4, sideOffset = 8, ...props },
    ref,
  ) => {
    return (
      <MenubarPortal ref={ref}>
        <MenubarPrimitive.Content
          data-slot="menubar-content"
          align={align}
          alignOffset={alignOffset}
          sideOffset={sideOffset}
          className={cn(
            "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[12rem] origin-(--radix-menubar-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-md",
            className,
          )}
          {...props}
        />
      </MenubarPortal>
    );
  },
);
MenubarContent.displayName = "MenubarContent";
const MenubarItem = React.forwardRef(
  ({ className, inset, variant = "default", ...props }, ref) => {
    return (
      <MenubarPrimitive.Item
        data-slot="menubar-item"
        data-inset={inset}
        data-variant={variant}
        className={cn(
          "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          className,
        )}
        {...props}
        ref={ref}
      />
    );
  },
);
MenubarItem.displayName = "MenubarItem";
const MenubarCheckboxItem = React.forwardRef(
  ({ className, children, checked, ...props }, ref) => {
    return (
      <MenubarPrimitive.CheckboxItem
        data-slot="menubar-checkbox-item"
        className={cn(
          "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-xs py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          className,
        )}
        checked={checked}
        {...props}
        ref={ref}
      >
        <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
          <MenubarPrimitive.ItemIndicator>
            <CheckIcon className="size-4" />
          </MenubarPrimitive.ItemIndicator>
        </span>
        {children}
      </MenubarPrimitive.CheckboxItem>
    );
  },
);
MenubarCheckboxItem.displayName = "MenubarCheckboxItem";
const MenubarRadioItem = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    return (
      <MenubarPrimitive.RadioItem
        data-slot="menubar-radio-item"
        className={cn(
          "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-xs py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          className,
        )}
        {...props}
        ref={ref}
      >
        <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
          <MenubarPrimitive.ItemIndicator>
            <CircleIcon className="size-2 fill-current" />
          </MenubarPrimitive.ItemIndicator>
        </span>
        {children}
      </MenubarPrimitive.RadioItem>
    );
  },
);
MenubarRadioItem.displayName = "MenubarRadioItem";
const MenubarLabel = React.forwardRef(({ className, inset, ...props }, ref) => {
  return (
    <MenubarPrimitive.Label
      data-slot="menubar-label"
      data-inset={inset}
      className={cn(
        "px-2 py-1.5 text-sm font-medium data-[inset]:pl-8",
        className,
      )}
      {...props}
      ref={ref}
    />
  );
});
MenubarLabel.displayName = "MenubarLabel";
const MenubarSeparator = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <MenubarPrimitive.Separator
      data-slot="menubar-separator"
      className={cn("bg-border -mx-1 my-1 h-px", className)}
      {...props}
      ref={ref}
    />
  );
});
MenubarSeparator.displayName = "MenubarSeparator";
const MenubarShortcut = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <span
      data-slot="menubar-shortcut"
      className={cn(
        "text-muted-foreground ml-auto text-xs tracking-widest",
        className,
      )}
      {...props}
      ref={ref}
    />
  );
});
MenubarShortcut.displayName = "MenubarShortcut";
const MenubarSub = React.forwardRef(({ ...props }, ref) => {
  return <MenubarPrimitive.Sub data-slot="menubar-sub" {...props} ref={ref} />;
});
MenubarSub.displayName = "MenubarSub";
const MenubarSubTrigger = React.forwardRef(
  ({ className, inset, children, ...props }, ref) => {
    return (
      <MenubarPrimitive.SubTrigger
        data-slot="menubar-sub-trigger"
        data-inset={inset}
        className={cn(
          "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none data-[inset]:pl-8",
          className,
        )}
        {...props}
        ref={ref}
      >
        {children}
        <ChevronRightIcon className="ml-auto h-4 w-4" />
      </MenubarPrimitive.SubTrigger>
    );
  },
);
MenubarSubTrigger.displayName = "MenubarSubTrigger";
const MenubarSubContent = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <MenubarPrimitive.SubContent
      data-slot="menubar-sub-content"
      className={cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-menubar-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg",
        className,
      )}
      {...props}
      ref={ref}
    />
  );
});
MenubarSubContent.displayName = "MenubarSubContent";
export {
  Menubar,
  MenubarPortal,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarGroup,
  MenubarSeparator,
  MenubarLabel,
  MenubarItem,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
};
