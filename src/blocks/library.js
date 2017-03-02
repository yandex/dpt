import scaffold from 'dpt-scaffold';

import Path from 'path';

import Block from './block';
import * as File from '../file';

export default class Library {
    constructor(name) {
        this.name = name;
    }

    path() {
        return Path.join(process.cwd(), 'blocks', this.name);
    }

    configPath() {
        return Path.join(this.path(), this.name + '.yaml');
    }

    blocks() {
        return File.listDirs(this.path())
            .filter(name => name[0] !== '.' && name !== 'const')
            .map(name => new Block(this, name));
    }

    readConfig() {
        return File.readYaml(this.configPath());
    }

    static all() {
        return File.listDirs(Path.join(process.cwd(), 'blocks'))
            .map(name => new Library(name));
    }

    static scaffold(config) {
        let source = Path.join(__dirname, '..', '..', '..', 'templates', 'lib');
        let dest = Path.join(process.cwd(), 'blocks');
        return scaffold(source, dest, config);
    }
}