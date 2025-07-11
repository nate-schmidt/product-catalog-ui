import type { DetailedHTMLProps, HTMLAttributes } from "react";

// Minimal jsx-runtime stub so the automatic JSX transform can resolve imports.
// The functions are typed as `any` to avoid implementation specifics while
// preventing implicit `any` errors in userland code.
declare module "react/jsx-runtime" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const jsx: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const jsxs: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const Fragment: any;
}

// Extend the global JSX namespace with strongly-typed HTML elements so JSX
// used in React components is type-checked (avoids implicit `any`).
declare global {
  namespace JSX {
    interface IntrinsicElements {
      div: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
      span: DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
      input: DetailedHTMLProps<HTMLAttributes<HTMLInputElement>, HTMLInputElement>;
      button: DetailedHTMLProps<HTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
      table: DetailedHTMLProps<HTMLAttributes<HTMLTableElement>, HTMLTableElement>;
      thead: DetailedHTMLProps<HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;
      tbody: DetailedHTMLProps<HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>;
      tr: DetailedHTMLProps<HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement>;
      td: DetailedHTMLProps<HTMLAttributes<HTMLTableCellElement>, HTMLTableCellElement>;
      th: DetailedHTMLProps<HTMLAttributes<HTMLTableCellElement>, HTMLTableCellElement>;
      h1: DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      h2: DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      h3: DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
      p: DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>;
      img: DetailedHTMLProps<HTMLAttributes<HTMLImageElement>, HTMLImageElement>;
      a: DetailedHTMLProps<HTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;
      svg: DetailedHTMLProps<HTMLAttributes<SVGSVGElement>, SVGSVGElement>;
      // catch-all to support any other tag names without implicit any errors
      [elemName: string]: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}