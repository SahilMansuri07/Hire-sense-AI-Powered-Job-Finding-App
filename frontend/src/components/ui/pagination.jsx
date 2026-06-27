import * as React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import { cn } from "./utils";
import { Button, buttonVariants } from "./button";
const Pagination = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
      ref={ref}
    />
  );
});
Pagination.displayName = "Pagination";
const PaginationContent = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
      ref={ref}
    />
  );
});
PaginationContent.displayName = "PaginationContent";
const PaginationItem = React.forwardRef(({ ...props }, ref) => {
  return <li data-slot="pagination-item" {...props} ref={ref} />;
});
PaginationItem.displayName = "PaginationItem";
const PaginationLink = React.forwardRef(
  ({ className, isActive, size = "icon", ...props }, ref) => {
    return (
      <a
        aria-current={isActive ? "page" : undefined}
        data-slot="pagination-link"
        data-active={isActive}
        className={cn(
          buttonVariants({
            variant: isActive ? "outline" : "ghost",
            size,
          }),
          className,
        )}
        {...props}
        ref={ref}
      />
    );
  },
);
PaginationLink.displayName = "PaginationLink";
const PaginationPrevious = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pl-2.5", className)}
      {...props}
      ref={ref}
    >
      <ChevronLeftIcon />
      <span className="hidden sm:block">Previous</span>
    </PaginationLink>
  );
});
PaginationPrevious.displayName = "PaginationPrevious";
const PaginationNext = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pr-2.5", className)}
      {...props}
      ref={ref}
    >
      <span className="hidden sm:block">Next</span>
      <ChevronRightIcon />
    </PaginationLink>
  );
});
PaginationNext.displayName = "PaginationNext";
const PaginationEllipsis = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
      ref={ref}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
});
PaginationEllipsis.displayName = "PaginationEllipsis";
export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
