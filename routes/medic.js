const express = require('express');

const mdAuth = require('../middlewares/auth');
const app = express();

const Medic = require('../models/medic');

//  ==============================================================
//  Get all medics
//  ==============================================================
app.get('/', (req, res) => {

    let page = req.query.page || 0;
    page = Number(page);

    Medic.find({})
        .skip(page)
        .limit(5)
        .populate('user', 'name email')
        .populate('hospital')
        .exec(
        (err, medics) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error load medics',
                    errors: err
                })
            }
            Medic.count({}, (err, cont) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error load medics',
                        errors: err
                    })
                }

                res.status(200).json({
                    ok: true,
                    medics: medics,
                    total: cont
                })
            });

        });
});

//  ==============================================================
//  Create medic
//  ==============================================================
app.post('/', mdAuth.verifyToken, (req, res) => {
    const body = req.body;
    const medic = new Medic({
        name: body.name,
        image: body.image,
        user: body.user,
        hospital: body.hospital
    });

    medic.save(( err, medicSave) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error save medic',
                errors: err
            })
        };
        res.status(201).json({
            ok: true,
            hospital: medicSave,
        })
    })
});

//  ==============================================================
//  Update medic by id
//  ==============================================================
app.put('/:id', mdAuth.verifyToken, ( req, res ) => {
    const id = req.params.id;
    const body = req.body;

    Medic.findById(id,( err, medic ) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error find medic',
                errors: err
            })
        };
        if ( !medic ) {
            res.status(400).json({
                ok: false,
                message: `El medico con el ${id} no existe`,
                errors: { message: 'no existe un medico con ese ID'}
            })
        };
        medic.name = body.name;
        medic.image = body.image;
        medic.hospital = body.hospital;
        medic.save(( err, medicSave ) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error update medico',
                    errors: err
                })
            };
            res.status(200).json({
                ok: true,
                user: medicSave
            });
        })
    });
});

//  ==============================================================
//  Remove medic by id
//  ==============================================================
app.delete('/:id', mdAuth.verifyToken, ( req, res ) => {
    const id = req.params.id;

    Medic.findByIdAndRemove(id, (err, medicDeleted) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error to deleted medic',
                errors: err
            })
        };
        if ( !medicDeleted ) {
            res.status(400).json({
                ok: false,
                message: `El medico con el ${id} no existe`,
                errors: { message: 'no existe un medico con ese ID'}
            })
        };
        res.status(200).json({
            ok: true,
            user: medicDeleted
        });
    });
});


module.exports = app;
