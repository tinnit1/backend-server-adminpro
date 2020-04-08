// Requires
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Initialize variables
const app = express()
const PORT = 3000;

//Body parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Import routes
const appRoutes = require('./routes/app')
const userRoutes = require('./routes/user')
const loginRoutes = require('./routes/login')

// connection data base Mongo
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', ( err, res ) => {
    if (err) throw err;
    console.log(`Data base \x1b[32m%s\x1b[0m`, `Online`);
});

// Routes
app.use('/user', userRoutes)
app.use('/login', loginRoutes)
app.use('/', appRoutes)

// listen request
app.listen(PORT, () => {console.log(`Express server run port ${PORT}: \x1b[32m%s\x1b[0m`, `Online`)});
