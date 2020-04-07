// Requires
const express = require('express');
const mongoose = require('mongoose');

// Initialize variables
const app = express()
const PORT = 3000;

// connection data base
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', ( err, res ) => {
    if (err) throw err;
    console.log(`Data base \x1b[32m%s\x1b[0m`, `Online`);
});

// Routes
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        message: 'peticion realizada correctamente'
    })
});

// listen request
app.listen(PORT, () => {console.log(`Express server run port ${PORT}: \x1b[32m%s\x1b[0m`, `Online`)});
