import fs from 'node:fs';

import browserslist from 'browserslist';
import esbuild from 'esbuild';
import { esbuildPluginBrowserslist } from 'esbuild-plugin-browserslist';

const browsers = browserslist('>= 0.5%');
const esbuildBrowsers = esbuildPluginBrowserslist(browsers, {
    printUnknownTargets: false,
});

const dest = 'dist/pf2e-calendar-compat.mjs';

const result = await esbuild.build({
    bundle: true,
    define: {
        fa: "foundry.applications",
        fav1: "foundry.appv1",
        fc: "foundry.canvas",
        fd: "foundry.documents",
        fh: "foundry.helpers",
        fu: "foundry.utils",
    },
    entryPoints: ['src/module.ts'],
    format: 'esm',
    keepNames: true,
    minify: true,
    outfile: dest,
    platform: 'browser',
    plugins: [esbuildBrowsers],
    pure: ['console.log', 'console.info'],
    sourcemap: true,
    sourceRoot: 'modules',
    metafile: true,
});

console.info(`Wrote ${fs.statSync(dest).size} bytes`);

fs.copyFileSync('module.json', 'dist/module.json');
