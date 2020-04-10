const express = require('express');

const app = express()
const Hospital = require('../models/hospital')
const Medic = require('../models/medic')
const User = require('../models/user')

//  ==============================================================
//  search per table
//  ==============================================================

app.get('/collection/:table/:search', ( req, res ) => {
    const table = req.params.table;
    const search = req.params.search;
    const regex = new RegExp( search, 'i' );
    let promise;

    switch ( table ) {
        case 'user':
           promise = searchUser(search, regex);
           break;
        case 'medic':
            promise = searchMedic(search, regex);
            break;
        case 'hospital':
            promise = searchHospital(search, regex);
            break;
        default:
            res.status(200).json({
                ok: true,
                message: 'Los tipos de busqueda no concuerdan',
                error : {message: 'tipos de tabla no correctos'}
            });
    }

    promise.then( data => {
        res.status(200).json({
            ok: true,
            [table]: data
        });
    })

});

//  ==============================================================
//  search all tables
//  ==============================================================

app.get('/all/:search', (req, res) => {

    const search = req.params.search;
    const regex = new RegExp( search, 'i' );

    Promise.all([searchHospital(search, regex), searchMedic(search, regex), searchUser(search, regex)])
        .then( responses => {
            res.status(200).json({
                ok: true,
                hospitals: responses[0],
                medics: responses[1],
                users: responses[2]
            })
        });
});

function searchHospital ( search, regExp ) {
    return new Promise( ( resolve , reject ) => {
        Hospital.find({ name: regExp })
            .populate('user', 'name email')
            .exec(( err, hospital) => {
            if ( err ) {
                reject(' Error al cargar hospitales', err)
            } else {
                resolve(hospital)
            }
        })
    });
}

function searchMedic ( search, regExp ) {
    return new Promise( ( resolve , reject ) => {
        Medic.find({ name: regExp })
            .populate('user', 'name email')
            .populate('hospital')
            .exec(( err, medic) => {
            if ( err ) {
                reject(' Error al cargar medicos', err)
            } else {
                resolve(medic)
            }
        })
    });
}

function searchUser ( search, regExp ) {
    return new Promise( ( resolve , reject ) => {
        User.find({}, 'name email role')
            .or([{'name': regExp}, {'email': regExp}])
            .exec( ( err, users) => {
                if ( err ) {
                    reject('Error al cargar usuarios', err)
                } else {
                    resolve( users )
                }
            })
    });
}


module.exports = app;
