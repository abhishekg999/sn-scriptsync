import * as babel from '@babel/core';

export function shouldTranspile(sourceCode: string): boolean {
    const header = sourceCode.split('\n')[0].trim();
    return header === '// @snutils:transpile';

}

export function transpile(sourceCode: string): string {
    if (!shouldTranspile(sourceCode)) {
        throw new Error('Source code does not contain the transpile directive');
    }

    // Remove the directive
    sourceCode = sourceCode.split('\n').slice(1).join('\n');

    const transpiledCode = babel.transformSync(sourceCode, {
        presets: [require('@babel/preset-env')],
        sourceType: 'script',
        plugins: [[require("babel-plugin-add-header-comment"), {
            "header": [
                "Script transpiled by SNUtils",
                `Original Source: ${Buffer.from(sourceCode).toString('base64')}`
            ]
        }]]
    });
    return transpiledCode.code
}
