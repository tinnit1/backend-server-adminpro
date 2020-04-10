const express = require('express');

const app = express();
const path = require('path');
const fs = require('fs');

app.get('/:type/:image', (req, res, next) => {

    const image = req.params.image;
    const type = req.params.type;

    const pathImage = path.resolve( __dirname, `../uploads/${ type }/${ image }`);
    if ( fs.existsSync(pathImage) ){
        res.sendFile( pathImage )
    } else {
        const pathNoImage = path.resolve( __dirname, `../assets/no-img.jpg`);
        res.sendFile( pathNoImage );
    }
});


module.exports = app;
