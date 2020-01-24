/*jslint(unexpected_space_a_b)*/
/*jshint esversion: 9*/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var itemSchema = new Schema({
    descripcion: String,
    cantidad: Number,
    valor: Number,
    idGroup: {
        type: Schema.Types.ObjectId,
        ref: 'GroupItems'
    },
    idFather: String, // ID del Usuario que creo el Item
    createdDate: {
        type: Date,
        default: Date.now()
    }
});

var groupItemsShecma = new Schema({
    descripcion: String,
    // items: [{ type: Schema.Types.ObjectId, ref: 'Item' }],
    idFather: String,
    createdDate: {
        type: Date,
        default: Date.now()
    }
});

var menuDSchema = new Schema({
    name: {
        type: String,
        require: false,
        default: 'null'
    },
    Create: {
        type: Boolean,
        required: false,
        default: false
    },
    Read: {
        type: Boolean,
        required: false,
        default: false
    },
    Update: {
        type: Boolean,
        required: false,
        default: false
    },
    Delete: {
        type: Boolean,
        required: false,
        default: false
    },
    idFather: {
        type: String,
        require: false,
        default: 'null'
    }, // Id del Módulo al que pertenece el menú
    createdDate: {
        type: Date,
        default: Date.now()
    }
});

var moduleSchema = new Schema({
    Concepto: {
        hasPermissionThisModule: {
            type: Boolean,
            require: false,
            default: false
        },
        accessToMenus: {
            type: Array,
            require: false,
            default: []
        }
    },
    Administracion: {
        hasPermissionThisModule: {
            type: Boolean,
            require: false,
            default: false
        },
        accessToMenus: {
            type: Array,
            require: false,
            default: []
        }
    },
    Cargo: {
        hasPermissionThisModule: {
            type: Boolean,
            require: false,
            default: false
        },
        accessToMenus: {
            type: Array,
            require: false,
            default: []
        }
    },
    Cliente: {
        hasPermissionThisModule: {
            type: Boolean,
            require: false,
            default: false
        },
        accessToMenus: {
            type: Array,
            require: false,
            default: []
        }
    },
    Reporte: {
        hasPermissionThisModule: {
            type: Boolean,
            require: false,
            default: false
        },
        accessToMenus: {
            type: Array,
            require: false,
            default: []
        }
    },
    idFather: {
        type: String,
        required: false,
        default: 'null'
    }, // Id del usuario al que pertenece este Conjunto de módulos
    createdDate: {
        type: Date,
        default: Date.now()
    }
});

// Esquema Mongoose para un Usuario que se enviará a la base de datos Mongo
var userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    hash: {
        type: String,
        rerquired: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now()
    },
    loggedIn: {
        type: Boolean,
        required: false,
        default: false
    },
    accesToken: {
        type: String,
        required: false,
        default: 'null'
    },
    rol: {
        type: String,
        required: false,
        default: 'user'
    },
    hasPermissionToModules: {
        type: Boolean,
        require: false,
        default: true
    },
    accessToModules: {
        type: String,
        required: false,
        default: 'null'
    }
});

itemSchema.set('toJson', {
    virtuals: true
});
groupItemsShecma.set('toJson', {
    virtuals: true
});
menuDSchema.set('toJSON', {
    virtuals: true
});
moduleSchema.set('toJSON', {
    virtuals: true
});
userSchema.set('toJSON', {
    virtuals: true
});

const Item = mongoose.model('Item', itemSchema);
const GroupItems = mongoose.model('GroupItems', groupItemsShecma);
const Access = mongoose.model('Access', moduleSchema);
const MenuD = mongoose.model('MenuD', menuDSchema);
const User = mongoose.model('User', userSchema);


module.exports = {
    Item,
    GroupItems,
    Access,
    MenuD,
    User
};