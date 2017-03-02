import Path from 'path';

import express from 'express';

import * as loader from './routes/loader';
import * as proxy from './routes/proxy';
import * as middleware from './routes/middleware';

export default function(render) {
    let router = express.Router();

    // Loader
    router.post('/api/loader/paths', loader.paths);

    // Proxy
    router.post('/proxy/json', proxy.json);
    router.get('/proxy', proxy.simple);

    // Statics
    let fileMap = {
        '/.core/loader.js': '../bundles/loader.js',
        '/.core/require-css.min.js': '../vendor/require-css.min.js',
        '/.core/require.js': '../vendor/require.js',
        '/.core/babel-polyfill.js': '../vendor/babel-polyfill.js'
    };

    for (let k in fileMap) {
        router.get(k, (req, res) => {
            res.sendFile(Path.join(__dirname, fileMap[k]));
        });
    }

    // Rendering and statics
    router.use(middleware.platform, render);
    router.use(express.static(process.cwd()));

    return router;
}