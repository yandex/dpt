import Path from 'path';

import autoprefixer from 'autoprefixer';
import lessc from 'less';
import postcss from 'postcss';

export default async function less(input, { path, ...opts }) {
    let options = {
        sourceMap: { sourceMapFileInline: true },
        filename: path,
        ieCompat: false,
        paths: [
            // file directory
            Path.dirname(path),

            // project config directory
            Path.join(process.cwd(), 'const')
        ],
        modifyVars: {
            platform: opts.platform
        }
    };

    let output = await lessc.render(input, options);
    let result = await postcss([autoprefixer]).process(output.css);

    let { imports } = output;
    imports.unshift(path);

    return {
        content: {
            body: result.css,
            mime: 'css'
        },
        dependencies: imports
    };
}
