
import { writeFile } from 'node:fs/promises';

import { flatConfigsToRulesDTS } from 'eslint-typegen/core';
import { builtinRules } from 'eslint/use-at-your-own-risk';

import configs from '../eslint.config.mts';
type Configs = Parameters<typeof flatConfigsToRulesDTS>[0];

const dts = await flatConfigsToRulesDTS([
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    { plugins: { '': { rules: Object.fromEntries(builtinRules.entries()) } } },
    ...configs,
] as Configs, {
    includeAugmentation: false,
});

await writeFile('build/eslint-types.d.ts', dts);
