'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = render;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _cache = require('../../cache');

var _cache2 = _interopRequireDefault(_cache);

var _logger = require('../../logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function render(compilers) {
    var cache = new _cache2.default();

    return function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(req, res) {
            var path, options, comp, compiler, _ref2, body, mime;

            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            path = _path2.default.join(process.cwd(), req.path);
                            options = _lodash2.default.pick(req, ['platform']);
                            comp = _lodash2.default.find(compilers, function (c) {
                                return c.test.test(path);
                            });

                            if (!comp) {
                                _context.next = 23;
                                break;
                            }

                            _context.prev = 4;
                            compiler = comp.compiler;
                            _context.next = 8;
                            return cache.cached(compiler)(options, path);

                        case 8:
                            _ref2 = _context.sent;
                            body = _ref2.body;
                            mime = _ref2.mime;

                            res.type(mime).send(body);
                            _context.next = 21;
                            break;

                        case 14:
                            _context.prev = 14;
                            _context.t0 = _context['catch'](4);

                            res.status(500).send('Error: ' + _context.t0.message);
                            _logger2.default.error(_context.t0);

                            if (_context.t0.codeFrame) {
                                _logger2.default.error(_context.t0.codeFrame);
                            }

                            if (_context.t0.filename) {
                                _logger2.default.error('in ' + _context.t0.filename + ' (' + _context.t0.line + ':' + _context.t0.column + ')');
                            }

                            throw _context.t0;

                        case 21:
                            _context.next = 24;
                            break;

                        case 23:
                            res.sendFile(path);

                        case 24:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this, [[4, 14]]);
        }));

        return function (_x, _x2) {
            return _ref.apply(this, arguments);
        };
    }();
}
module.exports = exports['default'];