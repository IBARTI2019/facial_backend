var mongoose = require('mongoose');
var Schema = mongoose.Schema;

let menuDSchema = new Schema({
    create: { type: Boolean, required: false, default: false },
    read: { type: Boolean, required: false, default: false },
    update: { type: Boolean, required: false, default: false },
    delete: { type: Boolean, required: false, default: false }
});


let accessSchema = new Schema({
    hasAcces: { type: Boolean, default: false },
    menuD: [menuDSchema]
});

menuDSchema.set('toJSON', { virtuals: true });
accessSchema.set('toJSON', { virtuals: true });

const Access = mongoose.model('Access', accessSchema);
const MenuD = mongoose.model('MenuD', menuDSchema);

module.exports = {
    Access,
    MenuD
};