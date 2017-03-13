import Path from 'path';
import childProcess from 'child_process';

import Server from './server';
import Library from './blocks/library';
import Block from './blocks/block';
import Version from './blocks/version';
import Render from './server/routes/render';
import logger from './logger';
import routes from './server/routes';

import { dedent } from './util';

function loadConfig() {
    const defaults = {
        url: '',
        repo: ''
    };

    let userConfig = {};

    let configPath = Path.join(process.cwd(), 'config.js');
    userConfig = require(configPath);

    return {
        ...defaults,
        ...userConfig,
        port: process.env.PORT || userConfig.port || 3040
    };
}

export default function main(options) {
    try {
        const app = { Library, Block, Version, logger };

        app.config = loadConfig();
        app.server = Server(app.config);

        app.compilers = app.config.compilers || [];

        (app.config.plugins || []).forEach(p => p(app));

        const render = Render(app.compilers);

        app.server.use(routes(render));

        app.server.listen(app.config.port, () => {
            console.log(dedent(`
                🚆 Depot running on port ${app.config.port}.
                Open http://localhost:${app.config.port} in your browser.
                Press Ctrl+C to quit.`));

            if (options.open) {
                childProcess.exec(`open http://localhost:${app.config.port}`);
            }
        });
    } catch (e) {
        logger.error(e);
    }
}
