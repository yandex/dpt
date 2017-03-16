import Qs from 'qs';

import DepotPlatform from './platform.js';
import ProgressBar from './progress-bar';

window.Platform = new DepotPlatform();

function parseQueryString() {
    return Qs.parse(window.location.search.substr(1));
}

function postJson(uri, data) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open('POST', uri, true)
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

        xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
                resolve(JSON.parse(xhr.responseText));
            } else {
                reject(xhr.responseText);
            }
        });

        xhr.addEventListener('error', () => {
            reject(xhr.responseText);
        });

        xhr.send(JSON.stringify(data));
    });
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
        let blocks = {...this._config.blocks, ...(conf.blocks || {}) };
        let imports = this._config.imports;
        
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
            let isBlock =
                k !== 'date' &&
                k !== 'platform' &&
                k.split('.').length === 2;

            if (isBlock) {
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

        window.requirejs(data.imports, async() => {
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
