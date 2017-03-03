'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.json = json;
exports.simple = simple;

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function json(req, res) {
    (0, _request2.default)({
        uri: encodeURI(req.body.url),
        headers: {
            'Cookie': req.headers['cookie'],
            'User-Agent': req.headers['user-agent']
        },
        strictSSL: false
    }, function (err, response, body) {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            res.status(200).send(body);
        }
    });
}

function simple(req, res) {
    (0, _request2.default)({
        uri: req.query.url,
        strictSSL: false
    }).pipe(res);
}