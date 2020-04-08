const jwt = require('jsonwebtoken');

const SEED = require('../config/config').SEED;

//  ==============================================================
//  verify token
//  ==============================================================
exports.verifyToken = function( req, res, next) {
    const token = req.query.token;

    jwt.verify( token, SEED, ( err, decoded ) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                message: 'Unauthorized',
                errors: err
            })
        }
        req.user = decoded.user;
         // res.status(200).json({
         //        ok: false,
         //        decoded: decoded
         //    })
        next();
    });
};

