import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import styles from "./SiteGrid.module.css";

/** For composing the grid onto another element (e.g. ScrollRevealGroup). */
export { styles as siteGridStyles };

type SiteGridProps<T extends ElementType = "div"> = {
  as?: T;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

/** Section shell + responsive 4 / 8 / 12-column grid (matches dev GridOverlay). */
export function SiteGridShell({
  children,
  className = "",
  ...rest
}: ComponentPropsWithoutRef<"div"> & { className?: string }) {
  return (
    <div className={`${styles.shell} ${className}`.trim()} {...rest}>
      {children}
    </div>
  );
}

/** Grid only — use inside SiteGridShell or another max-width wrapper. */
export function SiteGrid<T extends ElementType = "div">({
  as,
  children,
  className = "",
  ...rest
}: SiteGridProps<T>) {
  const Component = (as ?? "div") as ElementType;

  return (
    <Component className={`${styles.grid} ${className}`.trim()} {...rest}>
      {children}
    </Component>
  );
}

/** Shell + grid in one wrapper. */
export default function SiteGridSection({
  children,
  gridClassName = "",
  className = "",
  ...rest
}: ComponentPropsWithoutRef<"div"> & {
  gridClassName?: string;
  className?: string;
}) {
  return (
    <SiteGridShell className={className} {...rest}>
      <SiteGrid className={gridClassName}>{children}</SiteGrid>
    </SiteGridShell>
  );
}
