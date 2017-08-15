import Qs from 'qs';

import DepotPlatform from './platform.js';
import ProgressBar from './progress-bar';

window.Platform = new DepotPlatform();

function parseQueryString() {
    return Qs.parse(window.location.search.substr(1));
}

function postJson(uri, data, opts = {}) {
    return fetch(uri, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        ...opts
    }).then(r => r.json());
}

class DepotLoader {
    constructor() {
        this._config = this.initConfig();

        this._beforeLoad = [];
        this._afterLoad = [];
        this._loaded = false;

        this.showProgressBar = false;
    }

    config(conf = {}) {
        let { blocks, imports } = this._config;

        (conf.imports || []).forEach(i => {
            if (typeof i === 'string') {
                imports.push(i);
            } else {
                Object.assign(blocks, i);
            }
        });

        this._config = {
            ...this._config,
            ...conf,
            imports,
            blocks
        };

        return this;
    }

    initConfig() {
        let query = parseQueryString();
        let date = query.date;
        let platform = Platform.platform;
        let blocks = {};

        Object.keys(query).forEach(function(k) {
            if (k.split('.').length === 2) {
                blocks[k] = query[k];
            }
        });

        return { date, platform, blocks, imports: [] };
    }

    beforeLoad(fn) {
        this._beforeLoad.push(fn);
        return this;
    }

    afterLoad(fn) {
        if (this._loaded) {
            fn();
        } else {
            this._afterLoad.push(fn);
        }
        return this;
    }

    async load() {
        if (this.showProgressBar) {
            var pg = new ProgressBar(0.0);
            pg.autoincrement();
        }

        let data = await postJson('/api/loader/paths', {
            config: this._config
        });

        window.requirejs.config({
            waitSeconds: 100,
            urlArgs: 'platform=' + Platform.platform,
            map: {
                '*': {
                    ...data.paths,
                    beast: '/vendor/beast.js',
                    css: '/.core/require-css.min.js'
                }
            }
        });

        window.requirejs(data.imports, async () => {
            this._beforeLoad.forEach(fn => fn());
            if (this.showProgressBar) await pg.complete();
            this._afterLoad.forEach(fn => fn());

            this._loaded = true;
        });
    }
}

let Loader = new DepotLoader();
window.Loader = Loader;
document.addEventListener('DOMContentLoaded', () => Loader.load());
