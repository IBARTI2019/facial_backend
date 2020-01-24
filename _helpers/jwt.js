const expressJwt = require('express-jwt');
const config = require('config.json');
const userService = require('../users/user.service');
const clientService = require('../client/client.service');

module.exports = jwt;

function jwt() {
    const secret = config.secret;
    return expressJwt({ secret, isRevoked }).unless({
        path: [
            // Lista de rutas que no requieren Autenticación
            '/users/authenticate',
            '/users/logout',
            '/users/isLoggedIn',
            '/users/token',
            '/users/register',
            '/users/token',
            '/users/register'
        ]
    });
}

async function isRevoked(req, payload, done) {
    const user = await userService.getById(payload.sub);
    // Rovacar Toen si el usuario no existe
    if (!user) {
        console.log('User Not Found');
        return done(null, true);
    }

    done();
};