const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');

const app = express();

const User = require('../models/user');
const Medic = require('../models/medic');
const Hospital = require('../models/hospital');


app.use(fileUpload());

app.put('/:type/:id', (req, res, next) => {

    const type = req.params.type;
    const id = req.params.id;

    // collections types
    const colleTypes = ['hospital', 'medic', 'user'];
    if (colleTypes.indexOf(type) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'Tipos de colleciones no validas',
            errors: {message: 'No collection'}
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            message: 'Error al cargar el file',
            errors: {message: 'debe seleccionar una imagen'}
        });
    }

    // obtener nombre del file
    const file = req.files.image;
    const nameSplit = file.name.split('.');
    const extName = nameSplit [nameSplit.length - 1];

    // extenciones aceptadas
    const extValid = ['png', 'jpg', 'gif', 'jpeg'];

    if (extValid.indexOf(extName) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'Extencion no valida',
            errors: {message: 'Extenciones aceptadas ' + extValid.join(', ')}
        });
    }

    //nombre de archivo personalizado
    const fileName = `${id}-${new Date().getMilliseconds()}.${extName}`;

    // mover el archivo del temporal a un path
    const path = `./uploads/${type}/${fileName}`;

    file.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al mover archivo',
                errors: err
            });
        }
        uploadByType(type, id, fileName, res);
        // res.status(200).json({
        //     ok: true,
        //     message: 'archivo movido'
        // })
    })
});

function uploadByType(type, id, fileName, res) {
    switch (type) {
        case 'user':
            User.findById(id, (err, user) => {
                if ( !user ) {
                    return res.status(400).json({
                        ok: false,
                        message: 'Usuario no existe',
                        errors: {message: 'usuario no existe'}
                    });
                }
                const oldPath = './uploads/user/' + user.image;
                // si existe elimina el file
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(
                        oldPath,
                            err => {
                        return res.status(400).json({
                            ok: false,
                            message: 'Error al actualizar archivo',
                            errors: err
                        });
                    });
                }

                user.image = fileName;

                user.save((err, updateUser) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            message: 'Error al actualizar archivo',
                            errors: err
                        });
                    }
                    updateUser.password = ':)';
                    return res.status(200).json({
                        ok: true,
                        message: 'image user update',
                        user: updateUser

                    })
                });

            });
            break;
        case 'medic':
            Medic.findById(id, (err, medic) => {
                if ( !medic ) {
                    return res.status(400).json({
                        ok: false,
                        message: 'Medico no existe',
                        errors: {message: 'medico no existe'}
                    });
                }
                const oldPath = './uploads/medic/' + medic.image;
                // si existe elimina el file
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(
                        oldPath,
                        err => {
                            return res.status(400).json({
                                ok: false,
                                message: 'Error al actualizar archivo',
                                errors: err
                            });
                        });
                }

                medic.image = fileName;

                medic.save((err, updatMedic) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            message: 'Error al actualizar archivo',
                            errors: err
                        });
                    }
                    return res.status(200).json({
                        ok: true,
                        message: 'image medic update',
                        user: updatMedic

                    })
                });

            });
            break;
        case 'hospital':
            Hospital.findById(id, (err, hospital) => {
                if ( !hospital ) {
                    return res.status(400).json({
                        ok: false,
                        message: 'hospital no existe',
                        errors: {message: 'hospital no existe'}
                    });
                }
                const oldPath = './uploads/hospital/' + hospital.image;
                // si existe elimina el file
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(
                        oldPath,
                        err => {
                            return res.status(400).json({
                                ok: false,
                                message: 'Error al actualizar archivo',
                                errors: err
                            });
                        });
                }

                hospital.image = fileName;

                hospital.save((err, hospitalMedic) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            message: 'Error al actualizar archivo',
                            errors: err
                        });
                    }
                    return res.status(200).json({
                        ok: true,
                        message: 'image hospital update',
                        user: hospitalMedic

                    })
                });

            });
            break;
        default:
            res.status(200).json({
                ok: true,
                message: 'Los tipos de busqueda no concuerdan',
                error: {message: 'tipos de tabla no correctos'}
            });
    }
}


module.exports = app;
