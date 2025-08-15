import { basename } from 'node:path';

import esbuild from 'esbuild';
import { resolveToEsbuildTarget } from 'esbuild-plugin-browserslist';

import type {
    Asset, FoundryPackageJson, Input, TransformerOptions,
} from '../types';

import { isAndroid, writer } from './common';

function transformEsbuild(filePath: string): (manifest: FoundryPackageJson, options?: TransformerOptions) => Promise<Asset[]> {
    return async (manifest: FoundryPackageJson, options: TransformerOptions = {}) => {
        const target = options.browsers ? resolveToEsbuildTarget(options.browsers, { printUnknownTargets: false }) : undefined;

        const bundle = await esbuild.build({
            bundle: true,
            entryPoints: [filePath],
            external: ['*.webp', '*.jpg', '*.svg', '*.png'],
            minify: true,
            outfile: `${manifest.id}.css`,
            platform: 'browser',
            sourcemap: 'linked',
            sourceRoot: 'modules',
            target,
            write: false,
        });
        return bundle.outputFiles.map((output) => {
            console.error(output);
            return {
                fileName: basename(filePath),
                size: output.contents.length,
                write: writer(output.contents),
            };
        });
    };
}

function transformLightningCSS(filePath: string): (manifest: FoundryPackageJson, options?: TransformerOptions) => Promise<Asset[]> {
    return async (manifest: FoundryPackageJson, options: TransformerOptions = {}): Promise<Asset[]> => {
        const LightningCSS = await import('lightningcss');
        const targets = options.browsers ? LightningCSS.browserslistToTargets(options.browsers) : undefined;

        const { code, map } = await LightningCSS.bundleAsync({
            filename: filePath, minify: true, sourceMap: true, targets,
        });

        const outputs = [{
            fileName: `${manifest.id}.css`,
            size: code.length,
            write: writer(code),
        }];

        if (ArrayBuffer.isView(map)) {
            outputs.push({
                fileName: `${manifest.id}.css.map`,
                size: map.length,
                write: writer(map),
            });
        }

        return outputs;
    };
}

export function css(filePath: string): Input {
    const transform = isAndroid ? transformEsbuild(filePath) : transformLightningCSS(filePath);

    return { filePath, transform };
}
