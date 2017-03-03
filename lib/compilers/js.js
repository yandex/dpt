'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _babelCore = require('babel-core');

var babel = _interopRequireWildcard(_babelCore);

var _babelPluginTransformEs2015ModulesUmd = require('babel-plugin-transform-es2015-modules-umd');

var _babelPluginTransformEs2015ModulesUmd2 = _interopRequireDefault(_babelPluginTransformEs2015ModulesUmd);

var _babelPresetStage = require('babel-preset-stage-0');

var _babelPresetStage2 = _interopRequireDefault(_babelPresetStage);

var _babelPresetEs = require('babel-preset-es2015');

var _babelPresetEs2 = _interopRequireDefault(_babelPresetEs);

var _file = require('../file');

var File = _interopRequireWildcard(_file);

require('../vendor/beast');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(opts, path) {
        var blockPath, relPath, input, result;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        blockPath = _path2.default.resolve(path, '../../../../..');
                        relPath = _path2.default.relative(blockPath, _path2.default.resolve(path, '..'));
                        _context.next = 4;
                        return File.read(path);

                    case 4:
                        _context.t0 = '$1url(/' + relPath + '/$2)';
                        _context.t1 = JSON.stringify('/' + relPath);
                        input = _context.sent.replace(/(['"])url\((?!\/)([^'"]+)\)/g, _context.t0). // Image paths
                        replace('__BLOCK_PATH', _context.t1);


                        if (/\.bml($|\.)/.test(path)) {
                            input = Beast.parseBML(input);
                        }

                        result = babel.transform(input, {
                            babelrc: false,
                            sourceMaps: 'inline',
                            filename: path,
                            compact: true,
                            presets: [_babelPresetEs2.default, _babelPresetStage2.default],
                            plugins: !/loader\.js$/.test(path) && [_babelPluginTransformEs2015ModulesUmd2.default]
                        });
                        return _context.abrupt('return', {
                            body: result.code,
                            dependencies: [path],
                            mime: 'js'
                        });

                    case 10:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    function js(_x, _x2) {
        return _ref.apply(this, arguments);
    }

    return js;
}();

module.exports = exports['default'];