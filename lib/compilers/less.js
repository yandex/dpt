'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _autoprefixer = require('autoprefixer');

var _autoprefixer2 = _interopRequireDefault(_autoprefixer);

var _less = require('less');

var _less2 = _interopRequireDefault(_less);

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

var _file = require('../file');

var File = _interopRequireWildcard(_file);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(opts, path) {
        var options, input, output, result, imports;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        options = {
                            sourceMap: { sourceMapFileInline: true },
                            filename: path,
                            ieCompat: false,
                            paths: [
                            // file directory
                            _path2.default.dirname(path),

                            // project config directory
                            _path2.default.join(process.cwd(), 'const')],
                            modifyVars: {
                                platform: opts.platform
                            }
                        };
                        _context.next = 3;
                        return File.read(path);

                    case 3:
                        input = _context.sent;
                        _context.next = 6;
                        return _less2.default.render(input, options);

                    case 6:
                        output = _context.sent;
                        _context.next = 9;
                        return (0, _postcss2.default)([_autoprefixer2.default]).process(output.css);

                    case 9:
                        result = _context.sent;
                        imports = output.imports;

                        imports.unshift(path);

                        return _context.abrupt('return', {
                            body: result.css,
                            dependencies: imports,
                            mime: 'css'
                        });

                    case 13:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    function less(_x, _x2) {
        return _ref.apply(this, arguments);
    }

    return less;
}();

module.exports = exports['default'];