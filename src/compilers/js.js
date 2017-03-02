import Path from 'path';

import * as babel from 'babel-core';
import umd from 'babel-plugin-transform-es2015-modules-umd';
import presetStage0 from 'babel-preset-stage-0';
import presetES2015 from 'babel-preset-es2015';

import * as File from '../file';
import '../vendor/beast';

export default async function js(opts, path) {
    let blockPath = Path.resolve(path, '../../../../..');
    let relPath = Path.relative(blockPath, Path.resolve(path, '..'));

    let input = (await File.read(path))
        .replace(/(['"])url\((?!\/)([^'"]+)\)/g, `$1url(/${relPath}/$2)`) // Image paths
        .replace('__BLOCK_PATH', JSON.stringify('/' + relPath));

    if (/\.bml($|\.)/.test(path)) {
        input = Beast.parseBML(input);
    }

    let result = babel.transform(input, {
        babelrc: false,
        sourceMaps: 'inline',
        filename: path,
        compact: true,
        presets: [presetES2015, presetStage0],
        plugins: !/loader\.js$/.test(path) && [umd]
    });

    return {
        body: result.code,
        dependencies: [path],
        mime: 'js'
    };
}
