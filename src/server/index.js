import express from 'express';
import bodyParser from 'body-parser';
import _ from 'lodash';

import logger from '../logger';
import * as File from '../file';

function init(config) {
    const server = express();

    server.use(bodyParser.urlencoded({ extended: false }));
    server.use(bodyParser.json());

    return server;
}

export default init;