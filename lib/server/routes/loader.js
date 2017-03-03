'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.paths = undefined;

var resolveVersions = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(blocks, config) {
        var vs;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return _bluebird2.default.map(blocks, function (b) {
                            var key = b.qualifiedName();
                            if (config.blocks && !!config.blocks[key]) {
                                return b.resolveVersion(_version2.default.parse(config.blocks[key]));
                            } else if (config.date) {
                                return b.resolveVersion(_version2.default.parse(config.date));
                            } else {
                                return b.latestUsableVersion();
                            }
                        });

                    case 2:
                        vs = _context.sent;
                        return _context.abrupt('return', vs);

                    case 4:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function resolveVersions(_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();

var getPaths = function () {
    var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(blocks, config) {
        var versions, result, zipped, i, block, version, blockPath, filePath, qName;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.next = 2;
                        return resolveVersions(blocks, config);

                    case 2:
                        versions = _context2.sent;
                        result = {};
                        zipped = _lodash2.default.zip(blocks, versions);


                        for (i in blocks) {
                            block = blocks[i];
                            version = versions[i];


                            if (version) {
                                blockPath = block.versionPath(version);


                                if (blockPath) {
                                    filePath = '/' + _path2.default.relative(process.cwd(), _path2.default.join(blockPath, block.name));
                                    qName = block.qualifiedName();

                                    result[qName] = filePath + '.bml.js';
                                    result[qName + '.less'] = filePath + '.less';
                                    result[qName + '.styl'] = filePath + '.styl';
                                } else {
                                    LOGGER.warn('Could not find JS and/or CSS files for ' + block.qualifiedName());
                                }
                            }
                        }

                        return _context2.abrupt('return', result);

                    case 7:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));

    return function getPaths(_x3, _x4) {
        return _ref2.apply(this, arguments);
    };
}();

var paths = exports.paths = function () {
    var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(req, res) {
        var allBlocks, config, paths, imports;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        _context3.t0 = _lodash2.default;
                        _context3.next = 3;
                        return _library2.default.all().map(function (l) {
                            return l.blocks();
                        });

                    case 3:
                        _context3.t1 = _context3.sent;
                        allBlocks = _context3.t0.flatten.call(_context3.t0, _context3.t1);
                        config = req.body.config || {};
                        _context3.next = 8;
                        return getPaths(allBlocks, config);

                    case 8:
                        paths = _context3.sent;
                        imports = getImports(config);


                        res.json({ paths: paths, imports: imports });

                    case 11:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, this);
    }));

    return function paths(_x5, _x6) {
        return _ref3.apply(this, arguments);
    };
}();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _library = require('../../blocks/library');

var _library2 = _interopRequireDefault(_library);

var _version = require('../../blocks/version');

var _version2 = _interopRequireDefault(_version);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function getImports(config) {
    return _lodash2.default.uniq((config.imports || []).concat(Object.keys(config.blocks || {})));
}