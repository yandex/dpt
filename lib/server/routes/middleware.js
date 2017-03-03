'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.platform = platform;
// Platform detection middleware
function platform(req, res, next) {
    req.platform = req.query.platform || 'desktop';
    next();
}