import type { describe, it } from 'node:test';

type Describe = typeof describe;
type It = typeof it;
interface Assert {
    deepStrictEqual: (actual: any, expected: any) => void;
    strictEqual: (actual: any, expected: any) => void;
}

export type TestRunner = (context: TestContext) => void;

export interface TestContext {
    assert: Assert;
    describe: Describe;
    it: It;
}
