const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const roleValid = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
}

const userSchema = new Schema({
    name: {type: String, required: [true, 'El nombre es necesario']},
    email: {type: String, unique: true, required: [true, 'El email es necesario']},
    password: {type: String, required: [true, 'La contraseña es necesario']},
    image: {type: String, required: false},
    role: {type: String, required: true, default: 'USER_ROLE', enum: roleValid},
});

userSchema.plugin( uniqueValidator, { message: 'El {PATH} debe ser unico'} );

module.exports = mongoose.model('User', userSchema);
