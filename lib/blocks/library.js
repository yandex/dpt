'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dptScaffold = require('dpt-scaffold');

var _dptScaffold2 = _interopRequireDefault(_dptScaffold);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _block = require('./block');

var _block2 = _interopRequireDefault(_block);

var _file = require('../file');

var File = _interopRequireWildcard(_file);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Library = function () {
    function Library(name) {
        _classCallCheck(this, Library);

        this.name = name;
    }

    _createClass(Library, [{
        key: 'path',
        value: function path() {
            return _path2.default.join(process.cwd(), 'blocks', this.name);
        }
    }, {
        key: 'configPath',
        value: function configPath() {
            return _path2.default.join(this.path(), this.name + '.yaml');
        }
    }, {
        key: 'blocks',
        value: function blocks() {
            var _this = this;

            return File.listDirs(this.path()).filter(function (name) {
                return name[0] !== '.' && name !== 'const';
            }).map(function (name) {
                return new _block2.default(_this, name);
            });
        }
    }, {
        key: 'readConfig',
        value: function readConfig() {
            return File.readYaml(this.configPath());
        }
    }], [{
        key: 'all',
        value: function all() {
            return File.listDirs(_path2.default.join(process.cwd(), 'blocks')).map(function (name) {
                return new Library(name);
            });
        }
    }, {
        key: 'scaffold',
        value: function scaffold(config) {
            var source = _path2.default.join(__dirname, '..', '..', 'templates', 'lib');
            var dest = _path2.default.join(process.cwd(), 'blocks');
            return (0, _dptScaffold2.default)(source, dest, config);
        }
    }]);

    return Library;
}();

exports.default = Library;
module.exports = exports['default'];