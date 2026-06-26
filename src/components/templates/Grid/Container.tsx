import { cn } from "@/lib/utils/cn";
import type { ComponentPropsWithoutRef, ElementType } from "react";

type ContainerProps = ComponentPropsWithoutRef<"div"> & {
  /** Element to render. Defaults to "div"; pass "header"/"section"/"nav" for landmarks. */
  as?: ElementType;
};

/**
 * Global page container. Centralizes the site max-width + horizontal gutter so the
 * whole site can be re-sized from ONE place. Never hardcode `max-w-[…] mx-auto` for
 * page content — always wrap it in <Container>. Pass extra layout classes (padding,
 * sticky, etc.) via `className`; override the width with e.g. `className="max-w-[860px]"`.
 */
export function Container({ as: Tag = "div", className, children, ...rest }: ContainerProps) {
  return (
    <Tag className={cn("max-w-[1100px] mx-auto lg:px-8", className)} {...rest}>
      {children}
    </Tag>
  );
}
