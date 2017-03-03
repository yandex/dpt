'use strict';

require('babel-polyfill');

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _dptScaffold = require('dpt-scaffold');

var _dptScaffold2 = _interopRequireDefault(_dptScaffold);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _file = require('./file');

var File = _interopRequireWildcard(_file);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function init(name) {
    (0, _dptScaffold2.default)(_path2.default.resolve(__dirname, '../templates/project'), process.cwd(), { name: name }).then(function () {
        console.log('Project ' + name + ' was created successully');
    });
}

_commander2.default.version('0.1.0').command('new <name>').description('Create a dpt project').action(init);

if (process.argv.length <= 2) {
    require('./index.js');
} else {
    _commander2.default.parse(process.argv);
}