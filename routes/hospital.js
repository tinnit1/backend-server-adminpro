const express = require('express');

const mdAuth = require('../middlewares/auth');
const app = express();

const Hospital = require('../models/hospital');

//  ==============================================================
//  Get all hospitals
//  ==============================================================
app.get('/', (req, res) => {
    let page = req.query.page || 0;
    page = Number(page);

    Hospital.find({})
        .skip(page)
        .limit(5)
        .populate('user', 'name email')
        .exec(
        (err, hospitals) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error load hospitals',
                    errors: err
                })
            }
            Hospital.count({}, ( err, cont ) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error load hospitals',
                        errors: err
                    })
                }
                res.status(200).json({
                    ok: true,
                    hospitals: hospitals,
                    total: cont
                })
            })
        });
});

//  ==============================================================
//  Create hospital
//  ==============================================================
app.post('/', mdAuth.verifyToken, (req, res) => {
    const body = req.body;
    const hospital = new Hospital({
        name: body.name,
        user: req.user._id
    });

    hospital.save(( err, hospitalSave) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error save hospital',
                errors: err
            })
        };
        res.status(201).json({
            ok: true,
            hospital: hospitalSave,
        })
    })
});

//  ==============================================================
//  Update user
//  ==============================================================
app.put('/:id', mdAuth.verifyToken, ( req, res ) => {
    const id = req.params.id;
    const body = req.body;

    Hospital.findById(id,( err, hospital ) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error find hospital',
                errors: err
            })
        };
        if ( !hospital ) {
            res.status(400).json({
                ok: false,
                message: `El hospital con el ${id} no existe`,
                errors: { message: 'no existe un hospital con ese ID'}
            })
        };
        hospital.name = body.name;
        hospital.image = body.image;

        hospital.save(( err, hospitalSave ) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error update hospital',
                    errors: err
                })
            };
            res.status(200).json({
                ok: true,
                user: hospitalSave
            });
        })
    });
});

//  ==============================================================
//  Remove user by id
//  ==============================================================
app.delete('/:id', mdAuth.verifyToken, ( req, res ) => {
    const id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, userDeleted) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error to deleted hospital',
                errors: err
            })
        };
        if ( !userDeleted ) {
            res.status(400).json({
                ok: false,
                message: `El hospital con el ${id} no existe`,
                errors: { message: 'no existe un hospital con ese ID'}
            })
        };
        res.status(200).json({
            ok: true,
            user: userDeleted
        });
    });
});


module.exports = app;
