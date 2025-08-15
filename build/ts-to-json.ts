import * as fs from 'node:fs';

const [inFile, outFile] = process.argv.slice(2);

if (inFile && outFile) {
    const module: { default: object } = await import(inFile);

    const data = JSON.stringify(module.default, null, 4);
    fs.writeFileSync(outFile, data);
}
