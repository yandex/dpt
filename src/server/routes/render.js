import Path from 'path';

import _ from 'lodash';
import Promise from 'bluebird';

import * as File from '../../file';
import Cache from '../../cache';
import logger from '../../logger';

function compile(compilers) {
    return async function(options) {
        let input = await File.read(options.path);
        let init = {
            content: {
                body: input
            },
            dependencies: []
        };

        return Promise.reduce(compilers, async(acc, c) => {
            let result = await c(acc.content.body, options);
            return {
                content: result.content,
                dependencies: _.union(acc.dependencies, result.dependencies)
            };
        }, init);
    };
}

export default function render(compilers) {
    const cache = new Cache();

    return async function(req, res) {
        let path = Path.join(process.cwd(), req.path);
        let options = {
            platform: req.platform,
            path
        };

        let comp = _.find(compilers, c => c.test.test(path));

        if (comp && (comp.compilers || comp.compiler)) {
            try {
                let compilers = comp.compilers || [comp.compiler];
                let { body, mime } = await cache.cached(compile(compilers), options);
                res.type(mime).send(body);
            } catch (err) {
                res.status(500).send(`Error: ${err.message}`);
                logger.error(err);
            }
        } else {
            res.sendFile(path);
        }
    };
}
