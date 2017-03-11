import Promise from 'bluebird';
import _ from 'lodash';

import * as File from './file';

export default class Cache {
    constructor(storages = [new MemoryStorage()]) {
        this.storages = storages;
    }

    async get(id) {
        return await Promise.reduce(this.storages, async (acc, s) => {
            return acc || await s.get(id);
        });
    }

    async set(id, item) {
        await Promise.all(this.storages, s => s.set(id, item));
        return this;
    }

    async hasValid(id) {
        let item = await this.get(id);
        return item && await item.isValid();
    }

    cached(fn) {
        return async(...args) => {
            let id = JSON.stringify(...args);

            if (!this.hasValid(id)) {
                let result = await fn(...args);

                let dependencies = await Promise.all(
                    result.dependencies.map(async path =>
                        new Dependency(path, await File.mtime(path))
                    )
                );

                let item = new Item(result.content, dependencies);
                this.set(id, item);
            }

            return this.get(id).content;
        };
    }
}

class Item {
    constructor(content, dependencies) {
        this.content = content;
        this.dependencies = dependencies;
    }

    async isValid() {
        let depsAreValid = await Promise.all(this.dependencies.map(d => d.isValid()));
        return _.every(depsAreValid);
    }
}

class Dependency {
    constructor(path, mtime) {
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

export class MemoryStorage {
    constructor() {
        this.items = {};
    }

    // Get and set are async because other types of storage
    // will be async, e.g. FileStorage
    async get(id) {
        return this.items[id];
    }

    async set(id, item) {
        this.items[id] = item;
        return this;
    }

    async hasValid(id) {
        let item = this.get(id);
        return item && await item.isValid();
    }
}
