const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SEED = require('../config/config').SEED;

const app = express()
const User = require('../models/user');

// Google
const CLIENT_ID = require('../config/config').CLIENT_ID;
const {OAuth2Client} = require('google-auth-library');

const client = new OAuth2Client(CLIENT_ID);

//  ==============================================================
//  login with email and password
//  ==============================================================

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

//  ==============================================================
//  login with google
//  ==============================================================
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });

    const payload = ticket.getPayload();
    // const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
    return {
        name: payload.name,
        email: payload.email,
        image: payload.picture,
        google: true
    }
}

app.post('/google', async ( req, res ) => {
    let token = req.body.token;
    let googleUser = await verify(token)
        .catch( e => {
            res.status(403).json({
                ok: false,
                message: 'token no valido'
            })
        })

    User.findOne( { email: googleUser.email }, ( err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error find users',
                errors: err
            })
        }
        if ( userDB ) {
            if(userDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    message: 'Debe de usar autenticacion normal',
                })
            } else {
                const token = jwt.sign({user: userDB}, SEED,{ expiresIn: 14400});

                res.status(200).json({
                    ok: true,
                    user: userDB,
                    token: token,
                    id: userDB._id
                })
            }
        } else {
            // el usuario no existe crearlo

            const UserNew = new User();
            UserNew.name = googleUser.name;
            UserNew.email = googleUser.email;
            UserNew.image = googleUser.image;
            UserNew.google = true;
            UserNew.password = ':)';

            UserNew.save((err, userDB) => {
                const token = jwt.sign({user: userDB}, SEED,{ expiresIn: 14400});

                res.status(200).json({
                    ok: true,
                    user: userDB,
                    token: token,
                    id: userDB._id
                })
            });
        }
    });

    return res.status(200).json({
        ok: true,
        message: 'login with google',
        googleUser: googleUser
    })
});

module.exports = app;

