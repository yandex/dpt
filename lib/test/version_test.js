'use strict';

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _version = require('../blocks/version');

var _version2 = _interopRequireDefault(_version);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

describe('Version', function () {
    it('parses SemVer', function () {
        (0, _assert2.default)(_version2.default.parse('1.0.0').isSemVer());
        (0, _assert2.default)(_version2.default.parse('1.0.0test3').isSemVer());
        (0, _assert2.default)(_version2.default.parse('0.9123.0a').isSemVer());
        (0, _assert2.default)(!_version2.default.parse('notsemver').isSemVer());
        (0, _assert2.default)(!_version2.default.parse('a1.9.0s').isSemVer());

        var version1 = _version2.default.parse('1.0.0design');
        (0, _assert2.default)(version1.isSemVer());
        _assert2.default.equal(1, version1.major);
        _assert2.default.equal(0, version1.minor);
        _assert2.default.equal(0, version1.patch);
        _assert2.default.equal('design', version1.variant);
    });

    it('parses DateVer', function () {
        var version1 = _version2.default.parse('2015-08-12');

        (0, _assert2.default)(version1.isDateVer());
        (0, _assert2.default)(_version2.default.parse('2102-12-31').isDateVer());
        (0, _assert2.default)(!_version2.default.parse('notdatever').isDateVer());
        (0, _assert2.default)(!_version2.default.parse('1.0.31').isDateVer());
        (0, _assert2.default)(!_version2.default.parse('a2001-12-31b').isDateVer());

        _assert2.default.equal(2015, version1.year());
        _assert2.default.equal(8, version1.month());
        _assert2.default.equal(12, version1.day());
    });

    it('parses AnyVer', function () {
        (0, _assert2.default)(_version2.default.parse('any').isAnyVer());
        (0, _assert2.default)(_version2.default.parse('a1.0.0').isAnyVer());
    });

    it('sorts versions', function () {
        var versions = ['0.0.0', '1.0.0', '1.0.0a', '2015-03-12', '2015-08-12', 'any', 'design'].map(_version2.default.parse);
        var expected = versions.slice(0);

        for (var i = 0; i < 50; i++) {
            shuffle(versions);
            _assert2.default.deepEqual(expected, versions.sort(_version2.default.compare));
        }

        var semVer1 = _version2.default.parse('1.0.0');
        var semVer2 = _version2.default.parse('1.0.0a');
        var dateVer1 = _version2.default.parse('2015-03-01');
        var dateVer2 = _version2.default.parse('2015-05-21');
        var anyVer = _version2.default.parse('any');

        (0, _assert2.default)(semVer1.eq(semVer1));
        (0, _assert2.default)(semVer1.lt(semVer2));
        (0, _assert2.default)(semVer1.lt(dateVer1));
        (0, _assert2.default)(dateVer1.lt(dateVer2));
        (0, _assert2.default)(dateVer2.gt(dateVer1));
    });
});