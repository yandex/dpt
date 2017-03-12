import * as babel from 'babel-core';
import umd from 'babel-plugin-transform-es2015-modules-umd';
import presetStage0 from 'babel-preset-stage-0';
import presetES2015 from 'babel-preset-es2015';

export default async function js(input, { path, ...opts }) {
    let result;

    try {
        result = babel.transform(input, {
            babelrc: false,
            sourceMaps: 'inline',
            filename: path,
            compact: true,
            presets: [presetES2015, presetStage0],
            plugins: !/loader\.js$/.test(path) && [umd]
        });
    } catch (err) {
        if (err.codeFrame) {
            err.message += '\n' + err.codeFrame;
        }

        if (err.filename) {
            err.message += '\n' + `in ${err.filename} (${err.line}:${err.column})`;
        }

        throw err;
    }

    return {
        content: {
            body: result.code,
            mime: 'js'
        },
        dependencies: [path]
    };
}
