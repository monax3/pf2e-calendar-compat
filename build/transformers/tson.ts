import { parse as parsePath } from 'node:path';

import type {
    Asset, FoundryPackageJson, Input, TransformerOptions,
} from '../types';

import { importRelative, writer } from './common';

export function tson(filePath: string): Input {
    const transform = async (_manifest: FoundryPackageJson, _options: TransformerOptions = {}): Promise<Asset[]> => {
        const data = await importRelative(filePath);
        const json = JSON.stringify(data, undefined, 4);

        return [{
            fileName: `${parsePath(filePath).name}.json`,
            size: json.length,
            write: writer(json),
        }];
    };

    return { filePath, transform };
}
