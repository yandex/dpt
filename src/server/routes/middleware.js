// Platform detection middleware
export function platform(req, res, next) {
    req.platform = req.query.platform || 'desktop';
    next();
}
