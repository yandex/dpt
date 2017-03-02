import scaffold from 'dpt-scaffold';
import Moment from 'moment';
import Promise from 'bluebird';
import Shell from 'shelljs';
import _ from 'lodash/fp';

import Path from 'path';

import * as File from '../file';
import Library from './library';
import Version from './version';

export default class Block {
    constructor(library, name) {
        this.library = library;
        this.name = name;
    }

    qualifiedName() {
        return this.library.name + '.' + this.name;
    }

    path() {
        return Path.join(this.library.path(), this.name);
    }

    configPath() {
        return Path.join(this.path(), this.name + '.yaml');
    }

    versionPath(version) {
        return Path.join(this.path(), version.toString());
    }

    versions() {
        return File
            .listDirs(this.path())
            .map(Version.parse)
            .then(versions => versions.sort(Version.compare));
    }

    latestVersion() {
        return this.versions().then(_.last);
    }

    latestStableVersion() {
        return this.versions()
            .then(_.filter(v => v.isStable()))
            .then(_.last);
    }

    latestUsableVersion() {
        let stable, next, last;
        return this.versions().each(version => {
            last = version;
            if (version.isStable()) stable = version;
            if (version.isNext()) next = version;
        }).then(() => stable || next || last);
    }

    readConfig() {
        return File.readYaml(this.configPath()).catch(() => ({}));
    }

    async resolveVersion(target) {
        let versions = await this.versions();
        let result, next;

        let dateVersions = versions.filter(v => v.isDateVer());
        let anyVersions = versions.filter(v => v.isAnyVer());

        if (target.isDateVer() && dateVersions.length > 0) {
            if (dateVersions[0].gte(target)) {
                result = dateVersions[0];
            } else {
                result = _.last(dateVersions.filter(v => v.lte(target)));
            }
        } else {
            anyVersions.forEach(v => {
                if (v.eq(target)) {
                    result = v;
                }
                if (v.isNext()) {
                    next = v;
                }
            });
        }

        if (result || next) {
            return result || next;
        } else {
            throw new Error(`No version of block '${this.library.name}.${this.name}' was found that satisfied the '${target.toString()}' requirement`);
        }
    }

    snapshot() {
        let version = Moment().format('YYYY-MM-DD');
        let stableVersion = this.latestStableVersion();
        let nextVersion = this.resolveVersion(Version.parse('next'));

        return Promise.join(stableVersion, nextVersion)
            .then(([stable, next]) => {
                if (!next) {
                    throw new Error(`Next version of ${this.name} was not found`);
                }
                let stablePath = Path.join(this.path(), version + '/');
                Shell.rm('-rf', stablePath);
                Shell.mkdir('-p', stablePath);
                Shell.cp('-r', Path.join(this.path(), next.toString(), '*'), stablePath);

                return {
                    archived: stable,
                    stable: version
                };
            });
    }

    static parseQualifiedName(name) {
        let [libName, blockName] = name.split('.');
        return new Block(new Library(libName), blockName);
    }

    static scaffold(config) {
        let source = Path.join(__dirname, '..', '..', '..', 'templates', 'block');
        let dest = Path.join(process.cwd(), 'blocks', config.lib);
        return scaffold(source, dest, config);
    }
}