declare module "bun:test" {
  export const test: (...args: any[]) => any;
  export const expect: any;
  export const describe: any;
  export const beforeEach: any;
  export const afterEach: any;
  export const vi: any;
}