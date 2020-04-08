const express = require('express');
const jwt = require('jsonwebtoken');

const mdAuth = require('../middlewares/auth');
const app = express();
const bcrypt = require('bcryptjs');

const User = require('../models/user');

//  ==============================================================
//  Get all users
//  ==============================================================
app.get('/', (req, res, next) => {
    User.find({}, 'name email image role').exec(
        (err, users) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error load users',
                    errors: err
                })
            }

            res.status(200).json({
                ok: true,
                users: users
            })
        });
});

//  ==============================================================
//  Post user
//  ==============================================================
app.post('/', mdAuth.verifyToken, (req, res) => {
    const body = req.body;
    const user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        image: body.image,
        role: body.role
    });

    user.save(( err, userSave) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error save user',
                errors: err
            })
        };
        res.status(201).json({
            ok: true,
            users: userSave,
            userToken: req.user
        })
    })
});

//  ==============================================================
//  Update user
//  ==============================================================
app.put('/:id', mdAuth.verifyToken, ( req, res ) => {
    const id = req.params.id;
    const body = req.body;

    User.findById(id,( err, user ) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error find user',
                errors: err
            })
        };
        if ( !user ) {
            res.status(400).json({
                ok: false,
                message: `El usuario con el ${id} no existe`,
                errors: { message: 'no existe un suario con ese ID'}
            })
        };
        user.name = body.name;
        user.email = body.email;
        user.role = body.role;

        user.save(( err, userSave ) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error update user',
                    errors: err
                })
            };
            userSave.password = ':)';
            res.status(200).json({
                ok: true,
                user: userSave
            });
        })
    });
});

//  ==============================================================
//  Remove user by id
//  ==============================================================
app.delete('/:id', mdAuth.verifyToken, ( req, res ) => {
    const id = req.params.id;

    User.findByIdAndRemove(id, (err, userDeleted) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error to deleted user',
                errors: err
            })
        };
        if ( !userDeleted ) {
            res.status(400).json({
                ok: false,
                message: `El usuario con el ${id} no existe`,
                errors: { message: 'no existe un suario con ese ID'}
            })
        };
        res.status(200).json({
            ok: true,
            user: userDeleted
        });
    });
});


module.exports = app;
