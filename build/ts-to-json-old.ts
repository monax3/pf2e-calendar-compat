import fs from 'node:fs';

import { isNullish } from 'remeda';
import ts from 'typescript';

function removeExportsTransformer(
    context: ts.TransformationContext,
): ts.Transformer<ts.SourceFile> {
    function visitor(sourceFile: ts.SourceFile) {
        return (node: ts.Node): ts.VisitResult<ts.Node | undefined> => {
            switch (true) {
                case ts.isExportAssignment(node): {
                    const children = node.getChildren(sourceFile);

                    // const isDefault = !!children.find(
                    //     (c) => c.kind === ts.SyntaxKind.DefaultKeyword,
                    // );

                    const object = children.find(c =>
                        ts.isObjectLiteralExpression(c)) as any as ts.ObjectLiteralExpression | undefined;
                    if (object) {
                        return ts.factory.createReturnStatement(object);
                    }

                    const identifier = children.find(c => ts.isIdentifier(c));
                    if (identifier) {
                        return identifier;
                    }

                    throw new Error('unimplemented');
                }
                case ts.isExportDeclaration(node): return undefined;
                default: return node;
            }
        };
    }

    return (sourceFile: ts.SourceFile) => ts.visitEachChild(sourceFile, visitor(sourceFile), context);
}

export function tsToJSON(inFile: string, outFile: string): void {
    const input = fs.readFileSync(inFile, 'utf8');

    const result = ts.transpileModule(input, {
        compilerOptions: {
            esModuleInterop: false,
            module: ts.ModuleKind.Preserve,
        },
        transformers: {
            before: [removeExportsTransformer],
        },
    });

    if (result.diagnostics && result.diagnostics.length > 0) {
        const host = {
            getCanonicalFileName: (fileName: string) => fileName,
            getCurrentDirectory: () => '.',
            getNewLine: () => '\n',
        };

        console.error(ts.formatDiagnostics(result.diagnostics, host));
        throw new Error('Compilation failed');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const run = new Function(result.outputText)();

    if (isNullish(run)) {
        throw new Error('No output from eval');
    }

    const data = JSON.stringify(run, null, 4);
    fs.writeFileSync(outFile, data);
}

const [inArg, outArg] = process.argv.slice(2);

if (inArg && outArg) {
    tsToJSON(inArg, outArg);
}
