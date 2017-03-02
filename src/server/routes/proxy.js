import request from 'request';

export function json(req, res) {
    request({
        uri: encodeURI(req.body.url),
        headers: {
            'Cookie': req.headers['cookie'],
            'User-Agent': req.headers['user-agent']
        },
        strictSSL: false
    }, function(err, response, body) {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            res.status(200).send(body);
        }
    });
}

export function simple(req, res) {
    request({
        uri: req.query.url,
        strictSSL: false
    }).pipe(res);
}
