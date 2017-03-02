import _ from 'lodash';

import Path from 'path';
import Promise from 'bluebird';

import Library from '../../blocks/library';
import Version from '../../blocks/version';

function getImports(config) {
    return _.uniq((config.imports || []).concat(Object.keys(config.blocks || {})));
}

async function resolveVersions(blocks, config) {
    let vs = await Promise.map(blocks, b => {
        let key = b.qualifiedName();
        if (config.blocks && !!config.blocks[key]) {
            return b.resolveVersion(Version.parse(config.blocks[key]));
        } else if (config.date) {
            return b.resolveVersion(Version.parse(config.date));
        } else {
            return b.latestUsableVersion();
        }
    });
    return vs;
}

async function getPaths(blocks, config) {
    let versions = await resolveVersions(blocks, config);

    let result = {};
    let zipped = _.zip(blocks, versions);

    for (let i in blocks) {
        let block = blocks[i];
        let version = versions[i];

        if (version) {
            let blockPath = block.versionPath(version);

            if (blockPath) {
                let filePath = '/' + Path.relative(process.cwd(), Path.join(blockPath, block.name));
                let qName = block.qualifiedName();
                result[qName] = filePath + '.bml.js';
                result[qName + '.less'] = filePath + '.less';
                result[qName + '.styl'] = filePath + '.styl';
            } else {
                LOGGER.warn('Could not find JS and/or CSS files for ' + block.qualifiedName());
            }
        }
    }

    return result;
}

export async function paths(req, res) {
    let allBlocks = _.flatten(await Library.all().map(l => l.blocks()));

    let config = req.body.config || {};

    let paths = await getPaths(allBlocks, config);
    let imports = getImports(config);

    res.json({ paths, imports });
}