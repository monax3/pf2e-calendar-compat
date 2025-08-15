import type { PathLike } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { platform } from 'node:os';
import { join as joinPath, relative } from 'node:path';
import { normalize, sep as posixSep } from 'node:path/posix';
import { sep as winSep } from 'node:path/win32';
import { cwd } from 'node:process';

export const isAndroid = platform() === 'android';
export const isWindows = platform() === 'win32';

function slash(p: string): string {
    return p.replaceAll(winSep, posixSep);
}

export async function importRelative<T = object>(file: string): Promise<T> {
    const { default: module } = await import(normalizePath(relative(import.meta.dirname, joinPath(cwd(), file))));
    return module as T;
}

export function normalizePath(id: string): string {
    return normalize(isWindows ? slash(id) : id);
}

export function writer(data: string | Uint8Array) {
    return async (dest: PathLike) => {
        await writeFile(dest, data);
    };
}
