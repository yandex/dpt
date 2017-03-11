import Path from 'path';

import autoprefixer from 'autoprefixer';
import stylus from 'stylus';
import postcss from 'postcss';

import * as File from '../file';

export default async function styl({ path, ...opts }) {
    let input = await File.read(path);
    let compiler = stylus(input)
        .set('filename', path)
        .define('$platform', opts.platform);
    let imports = compiler.deps();
    imports.unshift(path);
    let output = await new Promise((resolve, reject) => {
        compiler.render((err, css) => {
            if (err) {
                reject(err);
            } else {
                resolve(css);
            }
        });
    });
    let result = await postcss([autoprefixer]).process(output);

    return {
        content: {
            body: result.css,
            mime: 'css'
        },
        dependencies: imports
    };
}
