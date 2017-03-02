import Promise from 'bluebird';
import yaml from 'yaml-js';
import _ from 'lodash/fp';

import fs from 'fs';
import Path from 'path';

let readdirP = Promise.promisify(fs.readdir);
let statP = Promise.promisify(fs.stat);
let readFileP = Promise.promisify(fs.readFile);
let writeFileP = Promise.promisify(fs.writeFile);

function findP(f, xs) {
    return Promise.map(xs, f)
        .then(_.zipWith((source, result) => result && source, xs))
        .then(_.find(_.identity));
}

export function mtime(path) {
    return statP(path).then(stat => stat.mtime.getTime());
}

export function listRecursive(path) {
    return readdirP(path)
        .catch(function(err) {
            if (err.code === 'ENOTDIR') return [];
            else throw err;
        })
        .map(name => Path.join(path, name))
        .then(paths => Promise.map(paths, listRecursive)
            .then(result => [path].concat(result))
        )
        .then(_.flatten);
}

export function listFiles(path) {
    return readdirP(path)
        .filter(file =>
            statP(Path.join(path, file))
                .then(stat => !stat.isDirectory()));
}

export function listDirs(path) {
    return readdirP(path)
        .filter(file =>
            statP(Path.join(path, file))
                .then(stat => stat.isDirectory()));
}

export function read(path) {
    return readFileP(path, { encoding: 'utf-8' });
}

export function readYaml(path) {
    return read(path).then(yaml.load);
}

export function write(path, data) {
    return writeFileP(path, data);
}

export function exists(path) {
    return new Promise((resolve) => fs.exists(path, resolve));
}

export function ifExists(path, fn) {
    return exists(path).then(function(ex) {
        if (ex) {
            return fn(path);
        } else {
            return false;
        }
    });
}
// WHATT
export function ifExistsWith(fn) {
    return ifExists(path, fn);
}

export function withFirstExistent(fn, filePaths) {
    return findP(exists, filePaths)
        .then(function(result) {
            if (result) {
                return fn(result);
            } else {
                throw new Error('None of the paths tried exist:\n' + filePaths.join(',\n'));
            }
        });
}