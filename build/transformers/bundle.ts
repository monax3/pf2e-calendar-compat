/* eslint-disable @typescript-eslint/no-shadow */
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { resolveToEsbuildTarget } from 'esbuild-plugin-browserslist';
import { groupBy } from 'remeda';
import { rollup } from 'rollup';
import esbuildPlugin from 'rollup-plugin-esbuild';

import { getScope } from '../types';
import type {
    Asset, FoundryPackageJson, Input, TransformerOptions,
} from '../types';

import { writer } from './common';

function transform(filePath: string): (manifest: FoundryPackageJson, options?: TransformerOptions) => Promise<Asset[]> {
    return async (manifest: FoundryPackageJson, options: TransformerOptions = {}): Promise<Asset[]> => {
        const target = options.browsers ? resolveToEsbuildTarget(options.browsers, { printUnknownTargets: false }) : undefined;

        const inputOptions = {
            input: {
                [manifest.id]: filePath,
            },
            plugins: [
                esbuildPlugin({
                    minify: true,
                    target,
                }),
                nodeResolve({
                    browser: true,
                }),
            ],
            preserveSymlinks: false,
        };

        const manualChunks = groupBy(Object.keys(manifest.dependencies ??= {}), getScope);

        await using bundle = await rollup(inputOptions);

        const { output } = await bundle.generate({
            chunkFileNames: '[name].mjs',
            entryFileNames: '[name].mjs',
            format: 'es',
            generatedCode: 'es2015',
            manualChunks,
            sourcemap: true,
        });

        const outputs: Asset[] = [];

        for (const chunk of output.filter(chunk => chunk.type === 'chunk')) {
            outputs.push({
                fileName: chunk.fileName,
                size: chunk.code.length,
                write: writer(chunk.code),
            });

            if (chunk.map) {
                const sourcemap = chunk.map.toString();

                outputs.push({
                    fileName: `${chunk.fileName}.map`,
                    size: sourcemap.length,
                    write: writer(sourcemap),
                });
            }
        }

        return outputs;
    };
}

export function bundle(filePath: string): Input {
    return { filePath, transform: transform(filePath) };
}
