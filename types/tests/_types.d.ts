interface Assert {
    deepStrictEqual: (actual: any, expected: any) => void;
    strictEqual: (actual: any, expected: any) => void;
}
export type TestRunner = (context: TestContext) => void;
export interface TestContext {
    assert: Assert;
    describe: (name: string, fn: () => Promise<void> | void) => Promise<void> | void;
    it: (name: string, fn: () => Promise<void> | void) => Promise<void> | void;
}
export {};
//# sourceMappingURL=_types.d.ts.map