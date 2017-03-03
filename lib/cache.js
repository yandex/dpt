'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _file = require('./file');

var File = _interopRequireWildcard(_file);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Cache = function () {
    function Cache() {
        _classCallCheck(this, Cache);

        this.items = {};
    }

    _createClass(Cache, [{
        key: 'cached',
        value: function cached(fn) {
            var items = this.items;
            return function () {
                var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(opts, path) {
                    var _this = this;

                    var id, item, result, dependencies, _item;

                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                        while (1) {
                            switch (_context2.prev = _context2.next) {
                                case 0:
                                    id = path + JSON.stringify(opts);
                                    item = items[id];
                                    _context2.t0 = item;

                                    if (!_context2.t0) {
                                        _context2.next = 7;
                                        break;
                                    }

                                    _context2.next = 6;
                                    return item.isValid();

                                case 6:
                                    _context2.t0 = _context2.sent;

                                case 7:
                                    if (!_context2.t0) {
                                        _context2.next = 11;
                                        break;
                                    }

                                    return _context2.abrupt('return', {
                                        body: item.body,
                                        mime: item.mime
                                    });

                                case 11:
                                    _context2.next = 13;
                                    return fn(opts, path);

                                case 13:
                                    result = _context2.sent;
                                    _context2.next = 16;
                                    return Promise.all(result.dependencies.map(function () {
                                        var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(d) {
                                            var mtime;
                                            return regeneratorRuntime.wrap(function _callee$(_context) {
                                                while (1) {
                                                    switch (_context.prev = _context.next) {
                                                        case 0:
                                                            _context.next = 2;
                                                            return File.mtime(d);

                                                        case 2:
                                                            mtime = _context.sent;
                                                            return _context.abrupt('return', new Dependency({ path: d, mtime: mtime }));

                                                        case 4:
                                                        case 'end':
                                                            return _context.stop();
                                                    }
                                                }
                                            }, _callee, _this);
                                        }));

                                        return function (_x3) {
                                            return _ref2.apply(this, arguments);
                                        };
                                    }()));

                                case 16:
                                    dependencies = _context2.sent;
                                    _item = new Item({ body: result.body, dependencies: dependencies, mime: result.mime });

                                    items[id] = _item;
                                    return _context2.abrupt('return', {
                                        body: result.body,
                                        mime: result.mime
                                    });

                                case 20:
                                case 'end':
                                    return _context2.stop();
                            }
                        }
                    }, _callee2, this);
                }));

                return function (_x, _x2) {
                    return _ref.apply(this, arguments);
                };
            }();
        }
    }]);

    return Cache;
}();

exports.default = Cache;

var Item = function () {
    function Item(_ref3) {
        var body = _ref3.body,
            dependencies = _ref3.dependencies,
            mime = _ref3.mime;

        _classCallCheck(this, Item);

        this.body = body;
        this.dependencies = dependencies;
        this.mime = mime;
    }

    _createClass(Item, [{
        key: 'isValid',
        value: function () {
            var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
                var depsAreValid;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return Promise.all(this.dependencies.map(function (d) {
                                    return d.isValid();
                                }));

                            case 2:
                                depsAreValid = _context3.sent;
                                return _context3.abrupt('return', _lodash2.default.every(depsAreValid));

                            case 4:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function isValid() {
                return _ref4.apply(this, arguments);
            }

            return isValid;
        }()
    }]);

    return Item;
}();

Cache.Item = Item;

var Dependency = function () {
    function Dependency(_ref5) {
        var path = _ref5.path,
            mtime = _ref5.mtime;

        _classCallCheck(this, Dependency);

        this.path = path;
        this.mtime = mtime;
    }

    _createClass(Dependency, [{
        key: 'isValid',
        value: function () {
            var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.prev = 0;
                                _context4.t0 = this.mtime;
                                _context4.next = 4;
                                return File.mtime(this.path);

                            case 4:
                                _context4.t1 = _context4.sent;
                                return _context4.abrupt('return', _context4.t0 === _context4.t1);

                            case 8:
                                _context4.prev = 8;
                                _context4.t2 = _context4['catch'](0);

                                if (!(_context4.t2.cause && _context4.t2.cause.code === 'ENOENT')) {
                                    _context4.next = 14;
                                    break;
                                }

                                return _context4.abrupt('return', false);

                            case 14:
                                throw _context4.t2;

                            case 15:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this, [[0, 8]]);
            }));

            function isValid() {
                return _ref6.apply(this, arguments);
            }

            return isValid;
        }()
    }]);

    return Dependency;
}();

Cache.Dependency = Dependency;
module.exports = exports['default'];