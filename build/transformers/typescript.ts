import { readFile } from 'node:fs/promises';

import esbuild from 'esbuild';

import type {
    Asset, FoundryPackageJson, Input, TransformerOptions,
} from '../types';

import { writer } from './common';

export function typescript(filePath: string): Input {
    const transform = async (manifest: FoundryPackageJson, _options: TransformerOptions = {}): Promise<Asset[]> => {
        const input = await readFile(filePath);

        const { code } = await esbuild.transform(input, {
            platform: 'node',
            pure: ['console.log', 'console.info'],
            sourcemap: false,
            sourceRoot: 'modules',
        });

        return [{
            fileName: `${manifest.id}.js`,
            size: code.length,
            write: writer(code),
        }];
    };
    return { filePath, transform };
}
