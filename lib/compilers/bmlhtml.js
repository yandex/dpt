'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _yamlJs = require('yaml-js');

var _yamlJs2 = _interopRequireDefault(_yamlJs);

var _file = require('../file');

var File = _interopRequireWildcard(_file);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function frontMatter(str) {
    var regex = /^---$([\s\S]*?)---(\r?\n)*([\s\S]*)/m;

    var _regex$exec = regex.exec(str),
        _regex$exec2 = _slicedToArray(_regex$exec, 4),
        attrs = _regex$exec2[1],
        body = _regex$exec2[3];

    return {
        attributes: _yamlJs2.default.load(attrs || ''),
        body: body || str
    };
}

exports.default = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(opts, path) {
        var file, fm, config, body;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return File.read(path);

                    case 2:
                        file = _context.sent;
                        fm = frontMatter(file);
                        config = _lodash2.default.omit(fm.attributes, ['title']);
                        body = '\n<html>\n    <head>\n        <meta charset="UTF-8">\n        <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">\n        <title>' + (fm.attributes.title || 'Depot') + '</title>\n        <script src="/.core/babel-polyfill.js"></script>\n        <script src="/.core/require.js"></script>\n        <script src="/.core/loader.js"></script>\n    </head>\n    <body>\n        <script type="bml">\n            ' + fm.body + '\n        </script>\n        <script>\n            window.Loader.config(' + JSON.stringify(config) + ');\n        </script>\n    </body>\n</html>';
                        return _context.abrupt('return', {
                            body: body,
                            dependencies: [path],
                            mime: 'html'
                        });

                    case 7:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    function bmlhtml(_x, _x2) {
        return _ref.apply(this, arguments);
    }

    return bmlhtml;
}();

module.exports = exports['default'];