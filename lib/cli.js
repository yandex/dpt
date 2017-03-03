'use strict';

var init = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(name) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.prev = 0;
                        _context.next = 3;
                        return (0, _dptScaffold2.default)(_path2.default.resolve(__dirname, '../templates/project'), process.cwd(), { name: name });

                    case 3:
                        console.log((0, _util.dedent)('\n            Project ' + name + ' was created successully.\n            \n            Use the following commands to start now:\n            cd ' + name + '\n            npm install\n            npm start'));
                        _context.next = 9;
                        break;

                    case 6:
                        _context.prev = 6;
                        _context.t0 = _context['catch'](0);

                        _logger2.default.error('An error occurred while creating project ' + name + ':\n' + _context.t0);

                    case 9:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this, [[0, 6]]);
    }));

    return function init(_x) {
        return _ref.apply(this, arguments);
    };
}();

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _dptScaffold = require('dpt-scaffold');

var _dptScaffold2 = _interopRequireDefault(_dptScaffold);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _util = require('./util');

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function start() {
    require('./index');
}

_commander2.default.version('0.1.0').usage('dpt <command> [options]');

_commander2.default.command('init <name>').description('Create a Depot project').action(init);

_commander2.default.command('start').description('Run a project').action(start);

if (process.argv.length <= 2) {
    _commander2.default.help();
} else {
    _commander2.default.parse(process.argv);
}