import 'babel-polyfill';
import program from 'commander';
import scaffold from 'dpt-scaffold';

import Path from 'path';

import * as File from './file';

function init(name) {
    scaffold(
        Path.resolve(__dirname, '../../templates/project'),
        process.cwd(), { name }
    ).then(() => {
        console.log(`Project ${name} was created successully`);
    });
}

program
    .version('0.1.0')

.command('new <name>')
    .description('Create a dpt project')
    .action(init);

if (process.argv.length <= 2) {
    require('./index.js');
} else {
    program.parse(process.argv);
}