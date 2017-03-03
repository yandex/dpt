'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.mtime = mtime;
exports.listRecursive = listRecursive;
exports.listFiles = listFiles;
exports.listDirs = listDirs;
exports.read = read;
exports.readYaml = readYaml;
exports.write = write;
exports.exists = exists;
exports.ifExists = ifExists;
exports.ifExistsWith = ifExistsWith;
exports.withFirstExistent = withFirstExistent;

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _yamlJs = require('yaml-js');

var _yamlJs2 = _interopRequireDefault(_yamlJs);

var _fp = require('lodash/fp');

var _fp2 = _interopRequireDefault(_fp);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var readdirP = _bluebird2.default.promisify(_fs2.default.readdir);
var statP = _bluebird2.default.promisify(_fs2.default.stat);
var readFileP = _bluebird2.default.promisify(_fs2.default.readFile);
var writeFileP = _bluebird2.default.promisify(_fs2.default.writeFile);

function findP(f, xs) {
    return _bluebird2.default.map(xs, f).then(_fp2.default.zipWith(function (source, result) {
        return result && source;
    }, xs)).then(_fp2.default.find(_fp2.default.identity));
}

function mtime(path) {
    return statP(path).then(function (stat) {
        return stat.mtime.getTime();
    });
}

function listRecursive(path) {
    return readdirP(path).catch(function (err) {
        if (err.code === 'ENOTDIR') return [];else throw err;
    }).map(function (name) {
        return _path2.default.join(path, name);
    }).then(function (paths) {
        return _bluebird2.default.map(paths, listRecursive).then(function (result) {
            return [path].concat(result);
        });
    }).then(_fp2.default.flatten);
}

function listFiles(path) {
    return readdirP(path).filter(function (file) {
        return statP(_path2.default.join(path, file)).then(function (stat) {
            return !stat.isDirectory();
        });
    });
}

function listDirs(path) {
    return readdirP(path).filter(function (file) {
        return statP(_path2.default.join(path, file)).then(function (stat) {
            return stat.isDirectory();
        });
    });
}

function read(path) {
    return readFileP(path, { encoding: 'utf-8' });
}

function readYaml(path) {
    return read(path).then(_yamlJs2.default.load);
}

function write(path, data) {
    return writeFileP(path, data);
}

function exists(path) {
    return new _bluebird2.default(function (resolve) {
        return _fs2.default.exists(path, resolve);
    });
}

function ifExists(path, fn) {
    return exists(path).then(function (ex) {
        if (ex) {
            return fn(path);
        } else {
            return false;
        }
    });
}
// WHATT
function ifExistsWith(fn) {
    return ifExists(path, fn);
}

function withFirstExistent(fn, filePaths) {
    return findP(exists, filePaths).then(function (result) {
        if (result) {
            return fn(result);
        } else {
            throw new Error('None of the paths tried exist:\n' + filePaths.join(',\n'));
        }
    });
}