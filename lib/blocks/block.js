'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dptScaffold = require('dpt-scaffold');

var _dptScaffold2 = _interopRequireDefault(_dptScaffold);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

var _fp = require('lodash/fp');

var _fp2 = _interopRequireDefault(_fp);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _file = require('../file');

var File = _interopRequireWildcard(_file);

var _library = require('./library');

var _library2 = _interopRequireDefault(_library);

var _version = require('./version');

var _version2 = _interopRequireDefault(_version);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Block = function () {
    function Block(library, name) {
        _classCallCheck(this, Block);

        this.library = library;
        this.name = name;
    }

    _createClass(Block, [{
        key: 'qualifiedName',
        value: function qualifiedName() {
            return this.library.name + '.' + this.name;
        }
    }, {
        key: 'path',
        value: function path() {
            return _path2.default.join(this.library.path(), this.name);
        }
    }, {
        key: 'configPath',
        value: function configPath() {
            return _path2.default.join(this.path(), this.name + '.yaml');
        }
    }, {
        key: 'versionPath',
        value: function versionPath(version) {
            return _path2.default.join(this.path(), version.toString());
        }
    }, {
        key: 'versions',
        value: function versions() {
            return File.listDirs(this.path()).map(_version2.default.parse).then(function (versions) {
                return versions.sort(_version2.default.compare);
            });
        }
    }, {
        key: 'latestVersion',
        value: function latestVersion() {
            return this.versions().then(_fp2.default.last);
        }
    }, {
        key: 'latestStableVersion',
        value: function latestStableVersion() {
            return this.versions().then(_fp2.default.filter(function (v) {
                return v.isStable();
            })).then(_fp2.default.last);
        }
    }, {
        key: 'latestUsableVersion',
        value: function latestUsableVersion() {
            var stable = void 0,
                next = void 0,
                last = void 0;
            return this.versions().each(function (version) {
                last = version;
                if (version.isStable()) stable = version;
                if (version.isNext()) next = version;
            }).then(function () {
                return stable || next || last;
            });
        }
    }, {
        key: 'readConfig',
        value: function readConfig() {
            return File.readYaml(this.configPath()).catch(function () {
                return {};
            });
        }
    }, {
        key: 'resolveVersion',
        value: function () {
            var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(target) {
                var versions, result, next, dateVersions, anyVersions;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.versions();

                            case 2:
                                versions = _context.sent;
                                result = void 0, next = void 0;
                                dateVersions = versions.filter(function (v) {
                                    return v.isDateVer();
                                });
                                anyVersions = versions.filter(function (v) {
                                    return v.isAnyVer();
                                });


                                if (target.isDateVer() && dateVersions.length > 0) {
                                    if (dateVersions[0].gte(target)) {
                                        result = dateVersions[0];
                                    } else {
                                        result = _fp2.default.last(dateVersions.filter(function (v) {
                                            return v.lte(target);
                                        }));
                                    }
                                } else {
                                    anyVersions.forEach(function (v) {
                                        if (v.eq(target)) {
                                            result = v;
                                        }
                                        if (v.isNext()) {
                                            next = v;
                                        }
                                    });
                                }

                                if (!(result || next)) {
                                    _context.next = 11;
                                    break;
                                }

                                return _context.abrupt('return', result || next);

                            case 11:
                                throw new Error('No version of block \'' + this.library.name + '.' + this.name + '\' was found that satisfied the \'' + target.toString() + '\' requirement');

                            case 12:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function resolveVersion(_x) {
                return _ref.apply(this, arguments);
            }

            return resolveVersion;
        }()
    }, {
        key: 'snapshot',
        value: function snapshot() {
            var _this = this;

            var version = (0, _moment2.default)().format('YYYY-MM-DD');
            var stableVersion = this.latestStableVersion();
            var nextVersion = this.resolveVersion(_version2.default.parse('next'));

            return _bluebird2.default.join(stableVersion, nextVersion).then(function (_ref2) {
                var _ref3 = _slicedToArray(_ref2, 2),
                    stable = _ref3[0],
                    next = _ref3[1];

                if (!next) {
                    throw new Error('Next version of ' + _this.name + ' was not found');
                }
                var stablePath = _path2.default.join(_this.path(), version + '/');
                _shelljs2.default.rm('-rf', stablePath);
                _shelljs2.default.mkdir('-p', stablePath);
                _shelljs2.default.cp('-r', _path2.default.join(_this.path(), next.toString(), '*'), stablePath);

                return {
                    archived: stable,
                    stable: version
                };
            });
        }
    }], [{
        key: 'parseQualifiedName',
        value: function parseQualifiedName(name) {
            var _name$split = name.split('.'),
                _name$split2 = _slicedToArray(_name$split, 2),
                libName = _name$split2[0],
                blockName = _name$split2[1];

            return new Block(new _library2.default(libName), blockName);
        }
    }, {
        key: 'scaffold',
        value: function scaffold(config) {
            var source = _path2.default.join(__dirname, '..', '..', '..', 'templates', 'block');
            var dest = _path2.default.join(process.cwd(), 'blocks', config.lib);
            return (0, _dptScaffold2.default)(source, dest, config);
        }
    }]);

    return Block;
}();

exports.default = Block;
module.exports = exports['default'];