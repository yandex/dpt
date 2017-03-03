'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _server = require('./server');

var _server2 = _interopRequireDefault(_server);

var _library = require('./blocks/library');

var _library2 = _interopRequireDefault(_library);

var _block = require('./blocks/block');

var _block2 = _interopRequireDefault(_block);

var _version = require('./blocks/version');

var _version2 = _interopRequireDefault(_version);

var _render = require('./server/routes/render');

var _render2 = _interopRequireDefault(_render);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _routes = require('./server/routes');

var _routes2 = _interopRequireDefault(_routes);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function loadConfig() {
    var defaults = {
        url: '',
        repo: ''
    };

    var userConfig = {};

    var configPath = _path2.default.join(process.cwd(), 'config.js');
    userConfig = require(configPath);

    return _extends({}, defaults, userConfig, {
        port: process.env.PORT || userConfig.port || 3040
    });
}

function main() {
    try {
        var app = { Library: _library2.default, Block: _block2.default, Version: _version2.default, logger: _logger2.default };

        app.config = loadConfig();
        app.server = (0, _server2.default)(app.config);

        app.compilers = app.config.compilers || [];

        (app.config.plugins || []).forEach(function (p) {
            return p(app);
        });

        var render = (0, _render2.default)(app.compilers);

        app.server.use((0, _routes2.default)(render));

        app.server.listen(app.config.port, function () {
            console.log((0, _util.dedent)('\n                \uD83D\uDE86 Depot running on port ' + app.config.port + '.\n                Open http://localhost:' + app.config.port + ' in your browser.\n                Press Ctrl+C to quit.'));
            _child_process2.default.exec('open http://localhost:' + app.config.port);
        });
    } catch (e) {
        _logger2.default.error(e);
    }
}

main();