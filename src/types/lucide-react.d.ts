declare module "lucide-react" {
  import { FC, SVGProps } from "react";

  export interface LucideIcon extends FC<SVGProps<SVGSVGElement>> {}

  export const ShoppingCart: LucideIcon;
  export const X: LucideIcon;
  // You can extend with more icons as needed
}