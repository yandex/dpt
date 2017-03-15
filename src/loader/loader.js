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
        this.queryParams = parseQueryString();

        this.onLoad = function() {};
        this.hideContentWhileLoading = true;
        this.showProgressBar = true;
    }

    config(conf = {}) {
        let imports = this._config.imports.concat(conf.imports || []);
        let blocks = {...this._config.blocks, ...(conf.blocks || {}) };

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

        let blockDocPattern = /\/blocks\/([^\/]+)\/([^\/]+)\/([^\/]+)\/[\w\d\-_\.]+.(md|ex)/;
        let location = window.location.pathname;
        if (blockDocPattern.test(location)) {
            let matches = location.match(blockDocPattern);
            let blockName = matches[1] + '.' + matches[2];
            blocks[blockName] = matches[3];
        }

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

    retrievePaths() {
        const data = {
            config: {
                ...this._config
            }
        };

        return postJson('/api/loader/paths', data);
    }

    load() {
        if (this.hideContentWhileLoading) {
            document.body.style.visibility = 'hidden';
        }
        if (this.showProgressBar) {
            var pg = new ProgressBar(0.0);
            pg.autoincrement();
        }

        this.retrievePaths().then(data => {
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

            let complete = () => {
                if (typeof Beast !== 'undefined') Beast.init();
                document.body.style.visibility = 'visible';
                this.onLoad();
            };

            window.requirejs(data.imports, () => {
                if (this.showProgressBar) {
                    pg.complete(complete);
                } else {
                    complete();
                }
            });
        });
    }
}

let Loader = new DepotLoader();
window.Loader = Loader;
document.addEventListener('DOMContentLoaded', () => Loader.load());
