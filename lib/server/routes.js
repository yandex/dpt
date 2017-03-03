'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (render) {
    var router = _express2.default.Router();

    // Loader
    router.post('/api/loader/paths', loader.paths);

    // Proxy
    router.post('/proxy/json', proxy.json);
    router.get('/proxy', proxy.simple);

    // Statics
    var fileMap = {
        '/.core/loader.js': '../bundles/loader.js',
        '/.core/require-css.min.js': '../vendor/require-css.min.js',
        '/.core/require.js': '../vendor/require.js',
        '/.core/babel-polyfill.js': '../vendor/babel-polyfill.js'
    };

    var _loop = function _loop(k) {
        router.get(k, function (req, res) {
            res.sendFile(_path2.default.join(__dirname, fileMap[k]));
        });
    };

    for (var k in fileMap) {
        _loop(k);
    }

    // Rendering and statics
    router.use(middleware.platform, render);
    router.use(_express2.default.static(process.cwd()));

    return router;
};

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _loader = require('./routes/loader');

var loader = _interopRequireWildcard(_loader);

var _proxy = require('./routes/proxy');

var proxy = _interopRequireWildcard(_proxy);

var _middleware = require('./routes/middleware');

var middleware = _interopRequireWildcard(_middleware);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];