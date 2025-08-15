import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import type { Linter } from 'eslint';
import globals from 'globals';
import tseslint, { configs as tseconfigs } from 'typescript-eslint';

import type { RuleOptions } from './build/eslint-types.d';

const typescriptRules: Linter.RulesRecord = {
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/class-methods-use-this': 'off',
    '@typescript-eslint/consistent-indexed-object-style': 'off',
    '@typescript-eslint/consistent-type-assertions': 2,
    '@typescript-eslint/consistent-type-definitions': 'off',
    '@typescript-eslint/consistent-type-exports': [
        'error',
        { fixMixedExportsWithInlineTypeSpecifier: true },
    ],
    '@typescript-eslint/consistent-type-imports': [
        'error',
        { fixStyle: 'separate-type-imports', prefer: 'type-imports' },
    ],
    '@typescript-eslint/method-signature-style': ['error', 'property'],
    '@typescript-eslint/no-dynamic-delete': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-implied-eval': 'off',
    '@typescript-eslint/no-inferrable-types': 2,
    '@typescript-eslint/no-invalid-void-type': 'off',
    '@typescript-eslint/no-loop-func': 2,
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-unnecessary-parameter-property-assignment': 'error',
    '@typescript-eslint/no-unnecessary-type-parameters': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/prefer-function-type': 2,
    '@typescript-eslint/prefer-string-starts-ends-with': 2,
    '@typescript-eslint/require-await': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/strict-boolean-expressions': ['error', {
        allowNullableBoolean: true,
        allowNullableString: true,
    }],
    '@typescript-eslint/unbound-method': 'off',

    '@typescript-eslint/array-type': 2,
    '@typescript-eslint/default-param-last': 2,
    '@typescript-eslint/dot-notation': 2,
    // '@typescript-eslint/explicit-module-boundary-types': 'error',
    '@typescript-eslint/no-empty-function': 2,
    '@typescript-eslint/no-floating-promises': [
        'error',
        {
            allowForKnownSafeCalls: [
                { name: ['it', 'describe', 'test', 'suite'], from: 'package', package: 'node:test' },
            ],
        },
    ],
    '@typescript-eslint/no-import-type-side-effects': 2,
    '@typescript-eslint/no-unused-expressions': [
        2,
        {
            allowShortCircuit: true,
            allowTaggedTemplates: true,
            allowTernary: true,
            enforceForJSX: true,
        },
    ],
    '@typescript-eslint/prefer-nullish-coalescing': [
        2,
        { ignorePrimitives: true },
    ],
    '@typescript-eslint/prefer-optional-chain': 2,
    '@typescript-eslint/switch-exhaustiveness-check': [
        'error',
        { considerDefaultExhaustiveForUnions: true },
    ],
    '@typescript-eslint/unified-signatures': ['warn',
        { ignoreDifferentlyNamedParameters: true }],
} as const satisfies RuleOptions;

const stylisticRules: Linter.RulesRecord = {
    '@stylistic/array-bracket-newline': ['warn', 'consistent'],
    '@stylistic/array-element-newline': ['warn', { consistent: true, minItems: 6 }],
    '@stylistic/arrow-parens': ['warn', 'as-needed', { requireForBlockBody: true }],
    '@stylistic/brace-style': ['warn', '1tbs', { allowSingleLine: true }],
    '@stylistic/comma-dangle': ['warn', 'always-multiline'],
    '@stylistic/dot-location': ['warn', 'property'],
    '@stylistic/function-call-argument-newline': ['warn', 'consistent'],
    '@stylistic/function-paren-newline': ['warn', 'consistent'],
    '@stylistic/generator-star-spacing': ['warn', { after: true, before: false }],
    '@stylistic/implicit-arrow-linebreak': 'off',
    '@stylistic/indent': ['warn', 4],
    '@stylistic/indent-binary-ops': ['warn', 4],
    '@stylistic/lines-between-class-members': 'off',
    '@stylistic/member-delimiter-style': ['warn', {
        multiline: { delimiter: 'semi' },
        singleline: { delimiter: 'semi' },
    }],
    '@stylistic/multiline-comment-style': 'off',
    '@stylistic/multiline-ternary': ['warn', 'always-multiline'],
    '@stylistic/newline-per-chained-call': ['warn', { ignoreChainWithDepth: 2 }],
    '@stylistic/no-confusing-arrow': 'off',
    '@stylistic/no-trailing-spaces': 'warn',
    '@stylistic/object-curly-newline': ['warn', {
        ExportDeclaration: { consistent: true, minProperties: 4, multiline: true },
        ImportDeclaration: { consistent: true, minProperties: 4, multiline: true },
        ObjectExpression: { consistent: true, minProperties: 6, multiline: true },
        ObjectPattern: { consistent: true, minProperties: 6, multiline: true },
        TSInterfaceBody: { consistent: true, minProperties: 6, multiline: true },
        TSTypeLiteral: { consistent: true, minProperties: 6, multiline: true },
    }],
    '@stylistic/object-curly-spacing': ['warn', 'always'],
    '@stylistic/object-property-newline': ['warn', { allowAllPropertiesOnSameLine: true }],
    '@stylistic/operator-linebreak': ['warn', 'before'],
    '@stylistic/padded-blocks': ['warn', { blocks: 'never', classes: 'always', switches: 'never' }],
    '@stylistic/quote-props': ['warn', 'consistent-as-needed'],
    '@stylistic/quotes': ['warn', 'single', { allowTemplateLiterals: 'always', avoidEscape: true }],
    '@stylistic/semi': ['warn', 'always'],
    '@stylistic/space-before-function-paren': ['warn', { anonymous: 'always', asyncArrow: 'always', named: 'never' }],
    '@stylistic/yield-star-spacing': ['warn', { after: true, before: false }],
} as const satisfies RuleOptions;

const eslintRules: Linter.RulesRecord = {
    'array-callback-return': 'warn',
    'arrow-body-style': 'warn',
    'eqeqeq': ['warn', 'smart'],
    'logical-assignment-operators': ['warn', 'always', { enforceForIfStatements: true }],
    'no-await-in-loop': 'off',
    'no-constructor-return': 'error',
    'no-template-curly-in-string': 'error',
    'no-unmodified-loop-condition': 'error',
    // 'prefer-arrow-callback': 'warn',
    'require-atomic-updates': ['warn', { allowProperties: true }],
} as const satisfies RuleOptions;

const typescriptHandPickedRules: Linter.RulesRecord = {
    '@typescript-eslint/array-type': 2,
    '@typescript-eslint/ban-ts-comment': [
        2,
        {
            'ts-check': false,
            'ts-expect-error': false,
            'ts-ignore': true,
            'ts-nocheck': false,
        },
    ],
    '@typescript-eslint/consistent-type-assertions': 2,
    '@typescript-eslint/consistent-type-exports': [
        2,
        { fixMixedExportsWithInlineTypeSpecifier: true },
    ],
    '@typescript-eslint/consistent-type-imports': [
        2,
        {
            fixStyle: 'inline-type-imports',
        },
    ],
    '@typescript-eslint/default-param-last': 2,
    '@typescript-eslint/dot-notation': 2,
    '@typescript-eslint/explicit-function-return-type': ['warn', {
        allowExpressions: true,
    }],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/method-signature-style': 2,
    '@typescript-eslint/no-array-constructor': 0,
    '@typescript-eslint/no-empty-function': 2,
    '@typescript-eslint/no-empty-object-type': [
        2,
        {
            allowInterfaces: 'with-single-extends',
        },
    ],
    '@typescript-eslint/no-import-type-side-effects': 2,
    '@typescript-eslint/no-inferrable-types': 2,
    '@typescript-eslint/no-loop-func': 2,
    '@typescript-eslint/no-require-imports': 0, // eventually we will enable https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-module.md instead
    '@typescript-eslint/no-shadow': [
        2,
        {
            allow: ['resolve',
                'reject',
                'done',
                'next',
                'err',
                'error'],
            hoist: 'all',
            ignoreFunctionTypeParameterNameValueShadow: true,
            ignoreTypeValueShadow: true,
        },
    ],
    '@typescript-eslint/no-unsafe-assignment': 0,
    '@typescript-eslint/no-unused-expressions': [
        2,
        {
            allowShortCircuit: true,
            allowTaggedTemplates: true,
            allowTernary: true,
            enforceForJSX: true,
        },
    ],
    '@typescript-eslint/prefer-function-type': 2,
    '@typescript-eslint/prefer-nullish-coalescing': [
        2,
        { ignorePrimitives: true },
    ],
    '@typescript-eslint/prefer-optional-chain': 2,
    '@typescript-eslint/prefer-string-starts-ends-with': 2,
    '@typescript-eslint/use-unknown-in-catch-callback-variable': 0,
} as const satisfies RuleOptions;

const getBaseEslintHandPickedRules: Linter.RulesRecord = {
    'array-callback-return': [2, { allowImplicit: true, checkForEach: true }],
    'arrow-body-style': 0, // we are using the eslint-plugin-arrow-return-style version
    'curly': [2, 'all'],
    'default-param-last': 0, // we are using the @typescript/eslint version
    'dot-notation': 0, // we are using the @typescript/eslint version
    'no-array-constructor': 2,
    'no-caller': 2,
    'no-console': [2, {
        allow: [
            'warn',
            'error',
            'debug',
            'info',
            'table',
            'assert',
        ],
    }],
    'no-constant-binary-expression': 2,
    'no-else-return': 'off',
    'no-empty-function': 0, // we are using the @typescript/eslint version
    'no-eval': 2,
    'no-extend-native': 2,
    'no-extra-bind': 2,
    'no-extra-label': 2,
    'no-implicit-coercion': 2,
    'no-lone-blocks': 2,
    'no-multi-assign': 'off',
    'no-multi-str': 2,
    'no-negated-condition': 2,
    'no-nested-ternary': 2,
    'no-new-object': 2,
    'no-new-wrappers': 2,
    'no-octal-escape': 2,
    'no-param-reassign': 'off',
    'no-plusplus': 'off',
    'no-promise-executor-return': 2,
    'no-proto': 2,
    'no-redeclare': 'off',
    'no-restricted-imports': [
        2,
        {
            paths: [
                {
                    name: 'prop-types',
                    message: 'Dont use prop-types. Use Typescript instead.',
                },
            ],
            patterns: [
                {
                    group: ['node_modules'],
                    importNamePattern: '^', // this is to allow side-effects imports. See: https://github.com/eslint/eslint/pull/18997.
                    message: 'Imports from node_modules are likely a user mistake.',
                },
                {
                    group: ['dist'],
                    importNamePattern: '^', // this is to allow side-effects imports. See: https://github.com/eslint/eslint/pull/18997.
                    message: 'Imports from dist are likely a user mistake.',
                },
            ],
        },
    ],
    'no-restricted-properties': [
        2,
        {
            message: 'Please use Number.isFinite instead',
            object: 'global',
            property: 'isFinite',
        },
        {
            message: 'Please use Number.isFinite instead',
            object: 'self',
            property: 'isFinite',
        },
        {
            message: 'Please use Number.isFinite instead',
            object: 'window',
            property: 'isFinite',
        },
        {
            message: 'Please use Number.isNaN instead',
            object: 'global',
            property: 'isNaN',
        },
        {
            message: 'Please use Number.isNaN instead',
            object: 'self',
            property: 'isNaN',
        },
        {
            message: 'Please use Number.isNaN instead',
            object: 'window',
            property: 'isNaN',
        },
    ],
    'no-return-assign': 'off',
    'no-return-await': 0, // we are using the @typescript/eslint version
    'no-sequences': 'off',
    'no-shadow': 0, // we are using the @typescript/eslint version
    'no-unmodified-loop-condition': 2,
    'no-unneeded-ternary': [2, { defaultAssignment: false }],
    'no-unreachable-loop': 2,
    'no-unused-expressions': 0, // we are using the @typescript/eslint version
    'no-use-before-define': 0, // we are using the @typescript/eslint version
    'no-useless-assignment': 2,
    'no-useless-call': 2,
    'no-useless-computed-key': 2,
    'no-void': 'off',
    'object-shorthand': 2,
    'operator-assignment': ['warn', 'always'],
    'prefer-arrow-callback': 'off',
    'prefer-destructuring': 'off',
    'prefer-object-has-own': 2,
    'prefer-object-spread': 2,
    'prefer-rest-params': 2,
    'prefer-template': 2,
    'require-atomic-updates': 2,
    'strict': [2, 'never'],
} as const satisfies RuleOptions;

const configs = tseslint.config(
    eslint.configs.recommended,
    ...tseconfigs.stylisticTypeChecked,
    ...tseconfigs.strictTypeChecked,
    stylistic.configs.all,
    { rules: eslintRules },
    { rules: getBaseEslintHandPickedRules },
    { rules: stylisticRules },
    { rules: typescriptRules },
    { rules: typescriptHandPickedRules },
);

const ignores = tseslint.config({
    ignores: [
        '.jj/',
        'foundry-src/',
        'dist/',
        '**/types/', // **/*.d.ts
        'macros/**/*.js',
        'patches/',
    ],
});

const options = tseslint.config(
    {
        languageOptions: {
            globals: { ...globals.node },
            parser: tsParser,
            parserOptions: {
                impliedStrict: true,
                tsconfigRootDir: import.meta.dirname,

                projectService: {
                    defaultProject: 'tsconfig.json',

                    allowDefaultProject: [
                        'prettier.config.cjs',
                        'babel.config.cjs',
                        '.pnpmfile.cjs',
                        'lie.js',
                    ],
                },
            },
        },
    },
);

export default [...configs, ...ignores, ...options];
