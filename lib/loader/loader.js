'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

var _platform = require('./platform.js');

var _platform2 = _interopRequireDefault(_platform);

var _progressBar = require('./progress-bar');

var _progressBar2 = _interopRequireDefault(_progressBar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

window.Platform = new _platform2.default();

// Main

function parseQueryString() {
    return _qs2.default.parse(window.location.search.substr(1));
}

var DepotLoader = function () {
    function DepotLoader() {
        _classCallCheck(this, DepotLoader);

        this._config = this.initConfig();
        this.raw = false;
        this.onLoad = function () {};
        this.queryParams = parseQueryString();
        this.hideContentWhileLoading = true;
        this.showProgressBar = true;
    }

    _createClass(DepotLoader, [{
        key: 'add',
        value: function add(conf) {
            console.warn('\'Loader.add\' is deprecated. Please use \'Loader.config\' instead.');
            return this.config(conf);
        }
    }, {
        key: 'config',
        value: function config(conf) {
            conf = conf || {};
            var imports = this._config.imports.concat(conf.imports || []);
            var blocks = _extends({}, this._config.blocks, conf.blocks || {});

            this._config = _extends({}, this._config, conf, {
                imports: imports,
                blocks: blocks
            });
            return this;
        }
    }, {
        key: 'initConfig',
        value: function initConfig() {
            var query = parseQueryString();
            var date = query.date;
            var platform = Platform.platform;
            var blocks = {};

            var blockDocPattern = /\/blocks\/([^\/]+)\/([^\/]+)\/([^\/]+)\/[\w\d\-_\.]+.(md|ex)/;
            var location = window.location.pathname;
            if (blockDocPattern.test(location)) {
                var matches = location.match(blockDocPattern);
                var blockName = matches[1] + '.' + matches[2];
                blocks[blockName] = matches[3];
            }

            Object.keys(query).forEach(function (k) {
                if (k !== 'date' && k !== 'platform' && k.split('.').length === 2) {
                    blocks[k] = query[k];
                }
            });

            return { date: date, platform: platform, blocks: blocks, imports: [] };
        }
    }, {
        key: 'retrievePaths',
        value: function retrievePaths() {
            var _this = this;

            return new Promise(function (resolve, reject) {
                var xhr = new XMLHttpRequest();

                var data = JSON.stringify({
                    config: _extends({
                        raw: _this.raw
                    }, _this._config)
                });

                xhr.open('POST', '/api/loader/paths', true);
                xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

                xhr.addEventListener('load', function () {
                    if (xhr.status === 200) {
                        resolve(JSON.parse(xhr.responseText));
                    } else {
                        reject(xhr.responseText);
                    }
                });

                xhr.addEventListener('error', function () {
                    reject(xhr.responseText);
                });

                xhr.send(data);
            });
        }
    }, {
        key: 'load',
        value: function load() {
            var _this2 = this;

            if (!this.raw) {
                if (this.hideContentWhileLoading) {
                    document.body.style.visibility = 'hidden';
                }
                if (this.showProgressBar) {
                    var pg = new _progressBar2.default(0.0);
                    var timer = setInterval(function () {
                        return pg.increment();
                    }, 200);
                }
            }

            this.retrievePaths().then(function (data) {
                window.requirejs.config({
                    baseUrl: '/',
                    waitSeconds: 100,
                    urlArgs: 'platform=' + Platform.platform,
                    map: {
                        '*': _extends({}, data.paths, {
                            'beast': '/vendor/beast.js',
                            css: '/.core/require-css.min.js'
                        })
                    }
                });

                if (_this2.raw) {
                    _this2.onLoad();
                } else {
                    var complete = function complete() {
                        if (typeof Beast !== 'undefined') Beast.init();
                        document.body.style.visibility = 'visible';
                        _this2.onLoad();
                    };

                    window.requirejs(data.imports, function () {
                        if (_this2.showProgressBar) {
                            clearInterval(timer);
                            pg.complete(complete);
                        } else {
                            complete();
                        }
                    });
                }
            });
        }
    }]);

    return DepotLoader;
}();

var Loader = new DepotLoader();
window.Loader = Loader;
document.addEventListener('DOMContentLoaded', Loader.load.bind(Loader));