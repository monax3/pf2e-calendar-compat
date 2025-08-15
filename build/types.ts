import type { PathLike } from 'node:fs';
import { platform } from 'node:os';
import { normalize, sep as posixSep } from 'node:path/posix';
import { sep as winSep } from 'node:path/win32';

import type { PackageJson } from '@package-json/types';

const LOCAL_SCOPE = 'gol.bz';

export const isAndroid = platform() === 'android';
export const isWindows = platform() === 'win32';

function slash(p: string): string {
    return p.replaceAll(winSep, posixSep);
}

export type AssetType = 'asset' | 'bundle' | 'css' | 'tson' | 'typescript';

export type FoundryModule = {
    manifest: FoundryPackageJson;
    module: ModuleJson;
};

export type FoundryPackageJson = PackageJson & { foundry?: boolean; id: string };

export type ModuleJson = {
    esmodules?: PathLike[];
    id: string;
    languages?: { lang: string; name: string; path: PathLike }[];
    styles?: PathLike[];
    title: string;
    version: string;
};

export type Transformer = (src: string, manifest: FoundryPackageJson, options?: TransformerOptions) => Promise<Asset[]>;

export interface Asset {
    fileName: string;
    size: number;
    write: (dest: PathLike) => Promise<void>;
}

export interface Input {
    filePath: string;
    transform: (manifest: FoundryPackageJson, options?: TransformerOptions) => Promise<Asset[]>;
}

export interface TransformerOptions {
    browsers?: string[];
}

export function getScope(id: string): string {
    const scoped = getScopedPackage(id);
    return scoped.scope === LOCAL_SCOPE ? scoped.package : scoped.scope;
}

export type { PackageJson } from '@package-json/types';

export function getScopedPackage(id: string): { package: string; scope: string } {
    if (id.startsWith('@')) {
        const sep = id.indexOf('/');
        console.assert(sep !== -1, `invalid package id ${id}`);
        return { package: id.slice(sep + 1), scope: id.slice(1, sep) };
    }
    return { package: id, scope: id };
}

export function normalizePath(id: PathLike): string {
    const idStr = id.toString();
    console.error(`${isWindows} normalizePath ${idStr} => ${normalize(isWindows ? slash(idStr) : idStr)}`);
    return normalize(isWindows ? slash(idStr) : idStr);
}
