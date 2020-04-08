const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SEED = require('../config/config').SEED;

const app = express()
const User = require('../models/user');

app.post('/', (req, res) => {
    const body = req.body;
    User.findOne({email: body.email}, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error find users',
                errors: err
            })
        }
        if (!userDB) {
            return res.status(400).json({
                ok: false,
                message: 'credenciales incorrectas - email',
                errors: err
            });
        }
        if (!bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(400).json({
                ok: false,
                message: 'credenciales incorrectas - password',
                errors: err
            });
        }

        // Create token !!
        userDB.password = ':)';
        const token = jwt.sign({user: userDB}, SEED,{ expiresIn: 14400});

        res.status(200).json({
            ok: true,
            user: userDB,
            token: token,
            id: userDB._id
        })
    });

});

module.exports = app;

