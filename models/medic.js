const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const medicoSchema = new Schema({
    name: {type: String, required: [true, 'El nombre es necesario']},
    image: {type: String, required: false},
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    hospital: {
        type: Schema.Types.ObjectId, ref: 'Hospital', required: [true, 'El id del hospital es un campo obligatorio']	}
    });

module.exports = mongoose.model('Medic', medicoSchema);
