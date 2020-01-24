/*jslint(out_of_scope_a)*/
/*jshint esversion: 9 */
var config = require('config.json');
var mongoose = require('mongoose');

mongoose.connect(
    process.env.MONGODB_URI || config.connectionString, {
        useNewUrlParser: true,
        useCreateIndex: true
    });

mongoose.Promise = global.Promise;

module.exports = {
    User: require('../users/user.model').User,
    Access: require('../users/user.model').Access,
    MenuD: require('../users/user.model').MenuD,
    Item: require('../users/user.model').Item,
    GroupItems: require('../users/user.model').GroupItems,
    Clientes: require('../client/client.model').Clientes,
    Ubicacion: require('../client/client.model').Ubicacion
};