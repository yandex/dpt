'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Version = function () {
    function Version() {
        _classCallCheck(this, Version);
    }

    _createClass(Version, [{
        key: 'toString',
        value: function toString() {
            throw new Error('String representations are defined only for concrete Version implementations');
        }
    }, {
        key: 'isStable',
        value: function isStable() {
            throw new Error('Stability is defined only for concrete Version implementations');
        }
    }, {
        key: 'isDateVer',
        value: function isDateVer() {
            return this instanceof DateVer;
        }
    }, {
        key: 'isAnyVer',
        value: function isAnyVer() {
            return this instanceof AnyVer;
        }
    }, {
        key: 'isNext',
        value: function isNext() {
            return false;
        }
    }, {
        key: 'compare',
        value: function compare(that) {
            throw new Error('Can only compare concrete Version implementations');
        }
    }, {
        key: 'lt',
        value: function lt(that) {
            return this.compare(that) < 0;
        }
    }, {
        key: 'lte',
        value: function lte(that) {
            return this.lt(that) || this.eq(that);
        }
    }, {
        key: 'gt',
        value: function gt(that) {
            return this.compare(that) > 0;
        }
    }, {
        key: 'gte',
        value: function gte(that) {
            return this.gt(that) || this.eq(that);
        }
    }, {
        key: 'eq',
        value: function eq(that) {
            return this.compare(that) === 0;
        }
    }], [{
        key: 'parse',
        value: function parse(str) {
            var dateVerRegExp = /^(\d{4})-(\d{2})-(\d{2})/;

            var dateVerParts = dateVerRegExp.exec(str);

            if (dateVerParts) {
                return new DateVer((0, _moment2.default)(str));
            } else {
                return new AnyVer(str);
            }
        }
    }, {
        key: 'compare',
        value: function compare(a, b) {
            return a.compare(b);
        }
    }]);

    return Version;
}();

exports.default = Version;

var AnyVer = function (_Version) {
    _inherits(AnyVer, _Version);

    function AnyVer(value) {
        _classCallCheck(this, AnyVer);

        var _this = _possibleConstructorReturn(this, (AnyVer.__proto__ || Object.getPrototypeOf(AnyVer)).call(this));

        _this.value = value;
        return _this;
    }

    _createClass(AnyVer, [{
        key: 'isStable',
        value: function isStable() {
            return false;
        }
    }, {
        key: 'isNext',
        value: function isNext() {
            return this.value === 'next';
        }
    }, {
        key: 'toString',
        value: function toString() {
            return this.value;
        }
    }, {
        key: 'compare',
        value: function compare(that) {
            if (that instanceof AnyVer) {
                return this.value === that.value ? 0 : this.value > that.value ? 1 : -1;
            } else {
                return 1;
            }
        }
    }]);

    return AnyVer;
}(Version);

var DateVer = function (_Version2) {
    _inherits(DateVer, _Version2);

    function DateVer(date) {
        _classCallCheck(this, DateVer);

        var _this2 = _possibleConstructorReturn(this, (DateVer.__proto__ || Object.getPrototypeOf(DateVer)).call(this));

        _this2.date = date;
        return _this2;
    }

    _createClass(DateVer, [{
        key: 'isStable',
        value: function isStable() {
            return true;
        }
    }, {
        key: 'year',
        value: function year() {
            return this.date.year();
        }
    }, {
        key: 'month',
        value: function month() {
            return this.date.month() + 1;
        }
    }, {
        key: 'day',
        value: function day() {
            return this.date.date();
        }
    }, {
        key: 'toString',
        value: function toString() {
            return this.date.format('YYYY-MM-DD');
        }
    }, {
        key: 'compare',
        value: function compare(that) {
            if (that instanceof AnyVer) {
                return -1;
            } else if (that instanceof DateVer) {
                return this.date.diff(that.date);
            } else {
                throw Error('Argument is not a version');
            }
        }
    }]);

    return DateVer;
}(Version);

module.exports = exports['default'];