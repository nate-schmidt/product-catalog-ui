declare module "bun" {
  export interface ServeOptions {
    routes: Record<string, any>;
    development?: any;
  }
  export interface BuildConfig {
    [key: string]: any;
  }
  export function build(config: BuildConfig): Promise<any>;
  export function serve(options: ServeOptions): any;
}

declare module "bun-plugin-tailwind" {
  const plugin: any;
  export default plugin;
}

declare module "*.html" {
  const content: string;
  export default content;
}

// Allow usage of Bun.Glob in build script without types
interface Bun {
  Glob: any;
}

declare const Bun: Bun;

declare module "bun:test" {
  export const test: any;
  export const expect: any;
  export const beforeEach: any;
  export const describe: any;
}

declare module "happy-dom" {
  export const Window: any;
}

declare module "fs" {
  export const existsSync: any;
}

declare module "fs/promises" {
  export const rm: any;
}

declare module "path" {
  const path: any;
  export default path;
}

declare const process: any;
declare const global: any;

declare module "@testing-library/user-event" {
  const userEvent: any;
  export default userEvent;
}