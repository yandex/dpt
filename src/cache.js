import _ from 'lodash';

import * as File from './file';

export default class Cache {
    constructor() {
        this.items = {};
    }

    cached(fn) {
        let items = this.items;
        return async function(opts, path) {
            let id = path + JSON.stringify(opts);
            let item = items[id];
            if (item && await item.isValid()) {
                return {
                    body: item.body,
                    mime: item.mime
                };
            } else {
                let result = await fn(opts, path);
                let dependencies = await Promise.all(result.dependencies.map(async d => {
                    let mtime = await File.mtime(d);
                    return new Dependency({path: d, mtime});
                }));
                let item = new Item({body: result.body, dependencies, mime: result.mime});
                items[id] = item;
                return {
                    body: result.body,
                    mime: result.mime
                };
            }
        };
    }
}

class Item {
    constructor({body, dependencies, mime}) {
        this.body = body;
        this.dependencies = dependencies;
        this.mime = mime;
    }

    async isValid() {
        let depsAreValid = await Promise.all(this.dependencies.map(d => d.isValid()));
        return _.every(depsAreValid);
    }
}

Cache.Item = Item;

class Dependency {
    constructor({path, mtime}) {
        this.path = path;
        this.mtime = mtime;
    }

    async isValid() {
        try {
            return this.mtime === await File.mtime(this.path);
        } catch (err) {
            if (err.cause && err.cause.code === 'ENOENT') {
                return false;
            } else {
                throw err;
            }
        }
    }
}

Cache.Dependency = Dependency;
