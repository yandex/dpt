import Qs from 'qs';

import DepotPlatform from './platform.js';
import ProgressBar from './progress-bar';

window.Platform = new DepotPlatform();

// Main

function parseQueryString() {
    return Qs.parse(window.location.search.substr(1));
}

class DepotLoader {
    constructor() {
        this._config = this.initConfig();
        this.raw = false;
        this.onLoad = function() {};
        this.queryParams = parseQueryString();
        this.hideContentWhileLoading = true;
        this.showProgressBar = true;
    }

    add(conf) {
        console.warn('\'Loader.add\' is deprecated. Please use \'Loader.config\' instead.');
        return this.config(conf);
    }

    config(conf) {
        conf = conf || {};
        let imports = this._config.imports.concat(conf.imports || []);
        let blocks = { ...this._config.blocks, ...(conf.blocks || {}) };

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
            if (k !== 'date' && k !== 'platform' && k.split('.').length === 2) {
                blocks[k] = query[k];
            }
        });


        return { date, platform, blocks, imports: [] };
    }

    retrievePaths() {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            const data = JSON.stringify({
                config: {
                    raw: this.raw,
                    ...this._config
                }
            });

            xhr.open('POST', '/api/loader/paths', true)
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

            xhr.send(data);
        });
    }

    load() {
        if (!this.raw) {
            if (this.hideContentWhileLoading) {
                document.body.style.visibility = 'hidden';
            }
            if (this.showProgressBar) {
                var pg = new ProgressBar(0.0);
                var timer = setInterval(() => pg.increment(), 200);
            }
        }

        this.retrievePaths().then(data => {
            window.requirejs.config({
                waitSeconds: 100,
                urlArgs: 'platform=' + Platform.platform,
                map: {
                    '*': {
                        ...data.paths,
                        'beast': '/vendor/beast.js',
                        css: '/.core/require-css.min.js'
                    }
                }
            });

            if (this.raw) {
                this.onLoad();
            } else {
                let complete = () => {
                    if (typeof Beast !== 'undefined') Beast.init();
                    document.body.style.visibility = 'visible';
                    this.onLoad();
                };

                window.requirejs(data.imports, () => {
                    if (this.showProgressBar) {
                        clearInterval(timer);
                        pg.complete(complete);
                    } else {
                        complete();
                    }
                });
            }
        });
    }
}

let Loader = new DepotLoader();
window.Loader = Loader;
document.addEventListener('DOMContentLoaded', Loader.load.bind(Loader));
