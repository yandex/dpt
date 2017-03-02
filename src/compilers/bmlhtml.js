import Path from 'path';

import _ from 'lodash';
import yaml from 'yaml-js';

import * as File from '../file';

function frontMatter(str) {
    const regex = /^---$([\s\S]*?)---(\r?\n)*([\s\S]*)/m;
    const [, attrs,, body] = regex.exec(str);

    return {
        attributes: yaml.load(attrs || ''),
        body: body || str
    };
}

export default async function bmlhtml(opts, path) {
    let file = await File.read(path);
    let fm = frontMatter(file);
    let config = _.omit(fm.attributes, ['title']);

    let body = `
<html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
        <title>${fm.attributes.title || 'Depot'}</title>
        <script src="/.core/babel-polyfill.js"></script>
        <script src="/.core/require.js"></script>
        <script src="/.core/loader.js"></script>
    </head>
    <body>
        <script type="bml">
            ${fm.body}
        </script>
        <script>
            window.Loader.config(${JSON.stringify(config)});
        </script>
    </body>
</html>`;

    return {
        body,
        dependencies: [path],
        mime: 'html'
    };
}
