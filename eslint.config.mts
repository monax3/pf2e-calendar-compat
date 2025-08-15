import type { Linter } from 'eslint';
// import * as tsResolver from 'eslint-import-resolver-typescript';
// import importPlugin from 'eslint-plugin-import-x';
import perfectionist from 'eslint-plugin-perfectionist';
import tsdoc from 'eslint-plugin-tsdoc';
// SONARJS import sonarjs from 'eslint-plugin-sonarjs';
import unicorn from 'eslint-plugin-unicorn';
import tseslint from 'typescript-eslint';

import type { RuleOptions } from './build/eslint-types.d';
import base from './eslint.base.mts';

const perfectionistPartition = {
    partitionByComment: true,
    partitionByNewLine: true,
};

interface CustomGroupAnyOfDefinition {
    type?: 'alphabetical' | 'line-length' | 'natural' | 'unsorted';
    anyOf: {
        elementNamePattern?: string;
        modifiers?: string[];
        selector?: string;
    }[];
    groupName: string;
    newlinesInside?: 'always' | 'never';
    order?: 'asc' | 'desc';
}

interface CustomGroupDefinition {
    type?: 'alphabetical' | 'line-length' | 'natural' | 'unsorted';
    decoratorNamePattern?: string;
    elementNamePattern?: string;
    elementValuePattern?: string;
    groupName: string;
    modifiers?: string[];
    newlinesInside?: 'always' | 'never';
    order?: 'asc' | 'desc';
    selector?: string;
}

const perfectionistGroupsLegacy = {
    metadata: ['^[iI]d$', '^[sS]lug$', '^[mM]etadata$', '^[kK]ind$', '^[tT]ype$'],
    name: ['^[lL]abel$', '^[nN]ame$'],
    descriptive: ['^[dD]escription$'],
    nesting: ['^[cC]hildren$'],
};

const perfectionistGroups: CustomGroupAnyOfDefinition[] = Object.entries(perfectionistGroupsLegacy).map(([groupName, patterns]) => ({
    anyOf: patterns.map(elementNamePattern => ({ elementNamePattern, selector: 'property' })),
    groupName,
    newlinesInside: 'never',
}));

const perfectionistClassGroups = [
    ...perfectionistGroups,
    ...perfectionistGroup('never', 'constructor'),
    ...perfectionistGroup('never', 'abstract-property'),
    ...perfectionistGroup('never', 'abstract-method'),
    ...perfectionistGroup('never', 'declare-property'),
    ...perfectionistGroup('never', 'readonly-property'),
    ...perfectionistGroup('never', 'property', 'accessor-property'),
    ...perfectionistGroup('never', 'protected-property', 'protected-accessor-property'),
    ...perfectionistGroup('never', 'private-property', 'private-accessor-property'),
    ...perfectionistGroup('always', 'override-method'),
    ...perfectionistGroup('always', 'get-method', 'set-method'),
    ...perfectionistGroup('always', 'protected-method'),
    ...perfectionistGroup('always', 'private-method'),
    ...perfectionistGroup('always', 'static-method'),
    ...perfectionistGroup('always', 'method'),
];

function getSelector(name: string): { modifiers?: string[]; selector: string } {
    const PERFECTIONIST_MODIFIERS: Record<string, Set<string>> = {
        'accessor-property': new Set(['abstract',
            'decorated',
            'override',
            'private',
            'protected',
            'public',
            'static']),
        'constructor': new Set(['private', 'protected', 'public']),
        'function-property': new Set(['abstract',
            'async',
            'declare',
            'decorated',
            'optional',
            'override',
            'private',
            'protected',
            'public',
            'readonly',
            'static']),
        'get-method': new Set(['abstract',
            'async',
            'decorated',
            'optional',
            'override',
            'private',
            'protected',
            'public',
            'static']),
        'index-signature': new Set(['readonly', 'static']),
        'method': new Set(['abstract',
            'async',
            'decorated',
            'optional',
            'override',
            'private',
            'protected',
            'public',
            'static']),
        'property': new Set(['abstract',
            'async',
            'declare',
            'decorated',
            'optional',
            'override',
            'private',
            'protected',
            'public',
            'readonly',
            'static']),
        'set-method': new Set(['abstract',
            'async',
            'decorated',
            'optional',
            'override',
            'private',
            'protected',
            'public',
            'static']),
        'static-block': new Set([]),
    };

    const parts = name.split('-');
    let selector = parts.slice(-2).join('-');
    let valid = PERFECTIONIST_MODIFIERS[selector];

    if (valid instanceof Set) {
        const modifiers = parts.slice(0, -2);
        if (modifiers.some(modifier => !valid!.has(modifier))) {
            throw new TypeError(`Invalid modifier one of ${JSON.stringify(modifiers)} in ${selector}`);
        }
        return { modifiers, selector };
    }

    selector = parts.slice(-1).join('-');
    valid = PERFECTIONIST_MODIFIERS[selector];

    if (valid instanceof Set) {
        const modifiers = parts.slice(0, -1);
        if (modifiers.some(modifier => !valid.has(modifier))) {
            throw new TypeError(`Invalid modifier one of ${JSON.stringify(modifiers)} in ${selector}`);
        }
        return { modifiers, selector };
    }

    throw new TypeError(`No valid property found in ${JSON.stringify(parts)}`);
}

function perfectionistGroup(newlinesInside: 'always' | 'never', ...names: string[]): CustomGroupDefinition[] {
    return names.flatMap((name) => {
        const { modifiers, selector } = getSelector(name);

        return {
            groupName: name,
            modifiers,
            newlinesInside,
            selector,
        };
    });
}

const perfectionistRules: Linter.RulesRecord = {
    'perfectionist/sort-classes': [
        'warn',
        {
            customGroups: perfectionistClassGroups,
            ignoreCase: false,
            newlinesBetween: 'ignore',
            partitionByComment: true,
            partitionByNewLine: false,

            groups: [
                'constructor',
                'index-signature',

                'static-property',
                'static-block',


                'abstract-property',
                { newlinesBetween: 'never' },
                'abstract-method',
                { newlinesBetween: 'never' },
                'declare-property',
                { newlinesBetween: 'always' },
                'metadata',
                { newlinesBetween: 'never' },
                'override-property',
                { newlinesBetween: 'never' },
                'name',
                { newlinesBetween: 'never' },
                'descriptive',
                { newlinesBetween: 'never' },
                'nesting',
                { newlinesBetween: 'never' },
                'readonly-property',
                { newlinesBetween: 'never' },
                ['property', 'accessor-property'],
                { newlinesBetween: 'never' },
                ['protected-property', 'protected-accessor-property'],
                { newlinesBetween: 'never' },
                ['private-property', 'private-accessor-property'],

                ['get-method', 'set-method'],
                'override-method',
                'method',
                'protected-method',
                'private-method',
                'static-method',
                'unknown',
            ],
        },
    ],
    'perfectionist/sort-imports': [
        'warn',
        {
            groups: [
                ['builtin-type', 'builtin'],
                ['external-type', 'external'],
                ['internal-type', 'internal'],
                ['parent-type', 'parent'],
                ['index-type', 'index'],
                ['sibling-type', 'sibling'],
                ['side-effect', 'side-effect-style'],
            ],
            internalPattern: ['^@gol.bz/.*'],
        },
    ],
    'perfectionist/sort-interfaces': [
        'warn', {
            ...perfectionistPartition,
            type: 'natural',
            customGroups: perfectionistGroups,
            groups: [
                'metadata',
                'name',
                'descriptive',
                ['unknown', 'multiline'],
                'method',
                'nesting',
            ],
            ignoreCase: false,
        },
    ],
    'perfectionist/sort-modules': [
        'warn', {
            type: 'natural',
            groups: [
                'declare-enum',
                'enum',
                'declare-type',
                'type',
                'declare-interface',
                'interface',
                'declare-class',
                'class',
                'declare-function',
                'function',
                'export-type',
                'export-enum',
                'export-interface',
                'export-function',
                'export-class',
            ],
            ignoreCase: false,
            newlinesBetween: 'ignore',
            partitionByComment: true,
        },
    ],
    'perfectionist/sort-named-imports': 'warn',
    'perfectionist/sort-object-types': ['warn', perfectionistPartition],
    'perfectionist/sort-objects': [
        'warn',
        {
            type: 'natural',
            groups: [
                'metadata',
                'name',
                'descriptive',
                ['unknown', 'multiline'],
                'method',
                'nesting',
            ],
            ignoreCase: false,
            ignorePattern: [],
            newlinesBetween: 'ignore',
            order: 'asc',
            partitionByComment: true,
            partitionByNewLine: true,
            specialCharacters: 'keep',
            styledComponents: true,

            customGroups: perfectionistGroupsLegacy,
        },
    ],
    'perfectionist/sort-switch-case': 'off',
} as const satisfies RuleOptions;

// const importRules: Linter.RulesRecord = {
//     'import-x/consistent-type-specifier-style': ['warn', 'prefer-top-level'],
//     'import-x/extensions': [
//         'error',
//         {
//             pattern: {
//                 js: 'always',
//                 json: 'always',
//                 ts: 'never',
//             },
//         },
//     ],
//     'import-x/first': 'warn',
//     'import-x/no-cycle': ['error', { ignoreExternal: true }],
//     'import-x/no-duplicates': ['warn', { 'prefer-inline': false }],
//     'import-x/no-internal-modules': [
//         'error',
//         { forbid: ['./pf2e*/**', '*@*/index'] },
//     ],
//     'import-x/no-named-as-default-member': 'off',
//     'import-x/no-useless-path-segments': ['error', { noUselessIndex: true }],
// } as const satisfies RuleOptions;

// const importConfig: Linter.Config[] = [
//     importPlugin.flatConfigs.recommended as Linter.Config,
//     importPlugin.flatConfigs.typescript as Linter.Config,
//     {
//         rules: importRules,
//         settings: {
//             'import-x/parser': {
//                 '@typescript-eslint/parser': ['.ts', '.tsx', '.mts'],
//             },
//             'import-x/resolver': {
//                 name: 'tsResolver',
//                 node: true,
//                 typescript: true,

//                 resolver: tsResolver,
//             },
//         },
//     } as const,
// ];

const unicornRules: Linter.RulesRecord = {
    'unicorn/import-style': 'off',
    'unicorn/no-array-callback-reference': 'off',
    'unicorn/no-array-reduce': 'off',
    'unicorn/no-empty-file': 'off',
    'unicorn/no-keyword-prefix': 'off',
    'unicorn/no-null': 'off',
    'unicorn/prefer-node-protocol': 'off',
    'unicorn/prefer-ternary': 'off',
    'unicorn/prevent-abbreviations': 'off',
    'unicorn/switch-case-braces': ['warn', 'avoid'],
    // new

    'unicorn/catch-error-name': 2,
    'unicorn/consistent-destructuring': 'off',
    'unicorn/consistent-empty-array-spread': 2,
    'unicorn/consistent-function-scoping': 2,
    'unicorn/explicit-length-check': 2,
    'unicorn/no-abusive-eslint-disable': 'off',
    'unicorn/no-array-push-push': 2,
    'unicorn/no-await-expression-member': 2,
    'unicorn/no-await-in-promise-methods': 2,
    'unicorn/no-for-loop': 2,
    'unicorn/no-instanceof-array': 2,
    'unicorn/no-new-array': 2,
    'unicorn/no-new-buffer': 2,
    'unicorn/no-single-promise-in-promise-methods': 2,
    'unicorn/no-unused-properties': 2,
    'unicorn/no-useless-fallback-in-spread': 2,
    'unicorn/no-useless-length-check': 2,
    'unicorn/no-useless-spread': 2,
    'unicorn/prefer-array-find': 2,
    'unicorn/prefer-array-flat': 2,
    'unicorn/prefer-array-flat-map': 2,
    'unicorn/prefer-array-index-of': 2,
    'unicorn/prefer-array-some': 2,
    'unicorn/prefer-date-now': 2,
    'unicorn/prefer-default-parameters': 2,
    'unicorn/prefer-event-target': 2,
    'unicorn/prefer-export-from': [2, { ignoreUsedVariables: true }],
    'unicorn/prefer-includes': 2,
    'unicorn/prefer-logical-operator-over-ternary': 2,
    'unicorn/prefer-native-coercion-functions': 2,
    'unicorn/prefer-object-from-entries': 2,
    'unicorn/prefer-prototype-methods': 2,
    'unicorn/prefer-query-selector': 2,
    'unicorn/prefer-set-size': 2,
    'unicorn/prefer-spread': 2,
    'unicorn/prefer-string-replace-all': 2,
    'unicorn/prefer-string-slice': 2,
    'unicorn/prefer-switch': [2, { emptyDefaultCase: 'do-nothing-comment' }],
    'unicorn/prefer-top-level-await': 2,
    'unicorn/prefer-type-error': 2,
    'unicorn/throw-new-error': 2,
} as const satisfies RuleOptions;

const unicornHandPickedRules: Linter.RulesRecord = {
    'unicorn/catch-error-name': 2,
    'unicorn/consistent-destructuring': 'off',
    'unicorn/consistent-empty-array-spread': 2,
    'unicorn/consistent-function-scoping': 2,
    'unicorn/explicit-length-check': 2,
    'unicorn/no-array-push-push': 2,
    'unicorn/no-array-reduce': 2,
    'unicorn/no-await-expression-member': 2,
    'unicorn/no-await-in-promise-methods': 2,
    'unicorn/no-for-loop': 2,
    'unicorn/no-instanceof-array': 2,
    'unicorn/no-new-array': 2,
    'unicorn/no-new-buffer': 2,
    'unicorn/no-single-promise-in-promise-methods': 2,
    'unicorn/no-unused-properties': 2,
    'unicorn/no-useless-fallback-in-spread': 2,
    'unicorn/no-useless-length-check': 2,
    'unicorn/no-useless-spread': 2,
    'unicorn/prefer-array-find': 2,
    'unicorn/prefer-array-flat': 2,
    'unicorn/prefer-array-flat-map': 2,
    'unicorn/prefer-array-index-of': 2,
    'unicorn/prefer-array-some': 2,
    'unicorn/prefer-date-now': 2,
    'unicorn/prefer-default-parameters': 2,
    'unicorn/prefer-event-target': 2,
    'unicorn/prefer-export-from': [2, { ignoreUsedVariables: true }],
    'unicorn/prefer-includes': 2,
    'unicorn/prefer-logical-operator-over-ternary': 2,
    'unicorn/prefer-native-coercion-functions': 2,
    'unicorn/prefer-node-protocol': 2,
    'unicorn/prefer-object-from-entries': 2,
    'unicorn/prefer-prototype-methods': 2,
    'unicorn/prefer-query-selector': 2,
    'unicorn/prefer-set-size': 2,
    'unicorn/prefer-spread': 2,
    'unicorn/prefer-string-replace-all': 2,
    'unicorn/prefer-string-slice': 2,
    'unicorn/prefer-switch': [2, { emptyDefaultCase: 'do-nothing-comment' }],
    'unicorn/prefer-top-level-await': 2,
    'unicorn/prefer-type-error': 2,
    'unicorn/switch-case-braces': 2,
    'unicorn/throw-new-error': 2,
} as const satisfies RuleOptions;

// SONARJS
// const sonarRules: Linter.RulesRecord = {
//     'sonarjs/cognitive-complexity': 'off',
//     'sonarjs/function-return-type': 'off',
//     'sonarjs/no-nested-template-literals': 'off',
//     'sonarjs/no-redundant-jump': 'off',
//     'sonarjs/no-small-switch': 'off',
//     'sonarjs/regex-complexity': 'off',
//     'sonarjs/slow-regex': 'off',
//     'sonarjs/void-use': 'off',

//     'sonarjs/fixme-tag': 'off',
//     'sonarjs/todo-tag': 'off',
// } as const satisfies RuleOptions;

export default tseslint.config(
    ...base,
    perfectionist.configs['recommended-natural'],
    unicorn.configs.all,
    { rules: unicornRules },
    { rules: unicornHandPickedRules },
    { rules: perfectionistRules },
    { plugins: { tsdoc }, rules: { 'tsdoc/syntax': 'warn' } },
    // SONARJS { rules: sonarRules },
    // importConfig
);
