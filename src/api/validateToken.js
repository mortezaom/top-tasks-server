const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token'] || req.headers['authorization'] || req.headers['x-token'] || req.query.token;
    if (!token) {
        return res.status(401).send({
            message: 'No token provided.'
        });
    }

    try {
        req.user = jwt.decode(token, process.env.TOKEN_SECRET);
        next();
    } catch (err) {
        return res.status(401).send({
            message: 'Invalid token.'
        });
    }
}
module.exports = verifyToken;