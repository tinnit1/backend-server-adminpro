const express = require('express');

const app = express()
const PORT = 3000;

app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        message: 'peticion realizada correctamente'
    })
});


module.exports = app;
