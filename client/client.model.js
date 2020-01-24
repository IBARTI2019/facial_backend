var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var clientesSchema = new Schema({
    descripcion: {
        type: String,
        require: false
    },
    identificacion: {
        type: String,
        requiere: false
    },
    direccion: {
        type: String,
        require: false
    },
    telefono: {
        type: String,
        require: false
    },
    representante: {
        type: String,
        require: false
    },
    telefono_representante: {
        type: String,
        require: false
    },
    status: {
        type: Boolean,
        require: false
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    ubicaciones: [{
        type: Schema.Types.ObjectId,
        ref: "Ubicacion"
    }]
});

var ubicacionSchema = new Schema({
    descripcion: {
        type: String,
        require: false
    },
    direccion: {
        type: String,
        require: false
    },
    status: {
        type: Boolean,
        require: false
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    cargos: [{
        cargo: {
            type: Schema.Types.ObjectId,
            ref: "Cargos"
        },
        roles: [{
            roll: {
                type: Schema.Types.ObjectId,
                ref: "Roll"
            },
            turnos: [{
                type: Schema.Types.ObjectId,
                ref: "Turnos"
            }]
        }]
    }],
    cliente: {
        type: Schema.Types.ObjectId,
        ref: 'Clientes'
    },
    conceptos: [{
        type: Schema.Types.ObjectId,
        ref: 'Conceptos'
    }]
});

clientesSchema.set('toJSON', {
    virtuals: true
});
ubicacionSchema.set('toJSON', {
    virtuals: true
});


const Clientes = mongoose.model('Clientes', clientesSchema);
const Ubicacion = mongoose.model('Ubicacion', ubicacionSchema);

module.exports = {
    Clientes,
    Ubicacion,
};