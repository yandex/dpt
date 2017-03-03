'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _autoprefixer = require('autoprefixer');

var _autoprefixer2 = _interopRequireDefault(_autoprefixer);

var _stylus = require('stylus');

var _stylus2 = _interopRequireDefault(_stylus);

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

var _file = require('../file');

var File = _interopRequireWildcard(_file);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(opts, path) {
        var input, compiler, imports, output, result;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return File.read(path);

                    case 2:
                        input = _context.sent;
                        compiler = (0, _stylus2.default)(input).set('filename', path).define('$platform', opts.platform);
                        imports = compiler.deps();

                        imports.unshift(path);
                        _context.next = 8;
                        return new Promise(function (resolve, reject) {
                            compiler.render(function (err, css) {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve(css);
                                }
                            });
                        });

                    case 8:
                        output = _context.sent;
                        _context.next = 11;
                        return (0, _postcss2.default)([_autoprefixer2.default]).process(output);

                    case 11:
                        result = _context.sent;
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

    function styl(_x, _x2) {
        return _ref.apply(this, arguments);
    }

    return styl;
}();

module.exports = exports['default'];