import program from 'commander';
import scaffold from 'dpt-scaffold';

import Path from 'path';

import { dedent } from './util';
import logger from './logger';

async function init(name) {
    try {
        await scaffold(
            Path.resolve(__dirname, '../templates/project'),
            process.cwd(), { name }
        );
        console.log(dedent(`
            Project ${name} was created successully.
            
            Use the following commands to start now:
            cd ${name}
            npm install
            npm start`
        ));
    } catch (e) {
        logger.error(`An error occurred while creating project ${name}:\n${e}`);
    }
}

function start(options) {
    require('./index')(options);
}

let meta = require('../package.json');

program
    .version(meta.version);

program.command('init <name>')
    .description('Create a Depot project')
    .action(init);

program.command('start')
    .description('Run a project')
    .option('--no-open', 'Don\'t open a browser window on start')
    .action(start);

if (process.argv.length <= 2) {
    program.help();
} else {
    program.parse(process.argv);
}
