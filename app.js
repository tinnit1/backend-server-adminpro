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
const medicRoutes = require('./routes/medic')
const loginRoutes = require('./routes/login')
const hospitalRoutes = require('./routes/hospital')
const searchRoutes = require('./routes/search')
const uploadRoutes = require('./routes/upload')
const imageRoutes = require('./routes/image')

// connection data base Mongo
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', ( err, res ) => {
    if (err) throw err;
    console.log(`Data base \x1b[32m%s\x1b[0m`, `Online`);
});

// Server index config
const serveIndex = require('serve-index');
app.use(express.static(__dirname + '/'))
app.use('/uploads', serveIndex(__dirname + '/uploads'));


// Routes
app.use('/user', userRoutes)
app.use('/hospital', hospitalRoutes)
app.use('/medic', medicRoutes)
app.use('/search', searchRoutes)
app.use('/login', loginRoutes)
app.use('/upload', uploadRoutes)
app.use('/image', imageRoutes)

app.use('/', appRoutes)

// listen request
app.listen(PORT, () => {console.log(`Express server run port ${PORT}: \x1b[32m%s\x1b[0m`, `Online`)});
