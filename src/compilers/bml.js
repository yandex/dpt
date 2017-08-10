import * as Path from 'path';

let Beast;

try {
    Beast = require(Path.join(process.cwd(), '/vendor/beast'));
} catch (e) {
    Beast = require('../vendor/beast');
}

export default function bml(input, {path}) {
    return {
        content: {
            body: Beast.parseBML(input)
        },
        dependencies: [path]
    };
}
