import Path from 'path';

import _ from 'lodash';

import Cache from '../../cache';
import logger from '../../logger';

export default function render(compilers) {
    const cache = new Cache();

    return async function(req, res) {
        let path = Path.join(process.cwd(), req.path);
        let options = {
            platform: req.platform,
            path
        };

        let comp = _.find(compilers, c => c.test.test(path));

        if (comp) {
            try {
                let { compiler } = comp;
                let { body, mime } = await cache.cached(compiler)(options);
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
