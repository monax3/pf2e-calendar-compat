import { statSync } from 'node:fs';
import type { PathLike } from 'node:fs';
import { copyFile, mkdir } from 'node:fs/promises';
import { dirname, relative } from 'node:path';

import { bundle } from './transformers/bundle';
import { normalizePath } from './transformers/common';
import { css } from './transformers/css';
import { tson } from './transformers/tson';
import { typescript } from './transformers/typescript';
import type { Asset, AssetType, Input } from './types';

function asset(filePath: string): Input {
    // fixme baseDir
    return identityInput(filePath)(filePath);
}
function assetCopier(src: PathLike) {
    return async function (dest: PathLike) {
        await mkdir(dirname(dest.toString()), { recursive: true });
        await copyFile(src, dest);
    };
}

function identityInput(baseDir: string) {
    return function (input: string): Input {
        return {
            filePath: normalizePath(input),
            transform: async () => [{
                fileName: normalizePath(relative(baseDir, input)),
                size: statSync(input).size,
                write: assetCopier(input),
            } satisfies Asset],
        };
    };
}

export function transformers(): Record<AssetType, (filePath: string) => Input> {
    return {
        asset,
        bundle,
        css,
        tson,
        typescript,
    };
}
