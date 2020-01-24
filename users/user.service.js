/*jslint(out_of_scope_a)*/
/*jshint esversion: 9 */
var config = require('config.json');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var db = require('_helpers/db');
var User = db.User;
var Module = db.Access;
var Item = db.Item;
var GroupItems = db.GroupItems;
var randT = require('rand-token');


var refreshTokens = {};

module.exports = {
    isLoggedIn,
    gNewTokenAcces,
    authenticate,
    getAll,
    getById,
    getModules,
    getItems,
    getGroupsItems,
    create,
    addItem,
    addGroupItems,
    update,
    updateGroupItems,
    updateItem,
    logout,
    delete: _delete,
};

async function isLoggedIn({
    username
}) {
    const user = await User.findOne({
        username
    });
    if (user !== null) {
        if (user.accesToken !== null) {
            try {
                jwt.verify(user.accesToken, config.secret);
            } catch (error) {
                // console.log(error.name, ' ', error.message);
                if (error.name === 'TokenExpiredError' && user.loggedIn) {
                    return (false);
                }
            }
        }
        return (user.loggedIn);
    }
    return null;
}

async function gNewTokenAcces(usernameparam, tokenRefresh) {
    // console.log('Data in refreshTokens: ', refreshTokens);
    // await db.dropCollection('Colection');
    // await db.dropCollection('Subcategoria');
    refreshTokens[tokenRefresh] = usernameparam;
    if (tokenRefresh in refreshTokens && refreshTokens[tokenRefresh] === usernameparam) {
        var user = await User.findOne({
            username: usernameparam
        });
        // console.log(user);
        if (user) {
            user.accesToken = jwt.sign({
                    name: user.username,
                    sub: user.id,
                    rol: user.rol
                },
                config.secret, {
                    expiresIn: 60
                });
            // console.log(user.accesToken);
            await user.save();
            return (user.accesToken);
        } else {
            return ('User Not Found');
        }
    } else {
        return ('User Not Authorized');
    }
}

async function authenticate({
    username,
    password
}) {
    const user = await User.findOne({
        username
    });

    if (user && bcrypt.compareSync(password, user.hash)) {
        user.loggedIn = true;
        const {
            hash,
            ...userWithoutHash
        } = user.toObject();
        const token = jwt.sign({
                name: username,
                sub: user.id,
                rol: user.rol
            },
            config.secret, {
                expiresIn: 60
            });

        user.accesToken = token;
        const tokenRefresh = randT.generate(16);
        refreshTokens[tokenRefresh] = username;
        await user.save();
        /*console.log('--------------------------------------');
        console.log('TokenRefresh: ', tokenRefresh);
        console.log('--------------------------------------');
        console.log('refreshTokens: ', refreshTokens);*/
        return {
            ...userWithoutHash,
            token,
            tokenRefresh
        };
    }
}

async function getAll() {
    return await User.find().select('-hash');
}

async function getById(id) {
    return await User.findOne({
        _id: id
    }).select('-hash');
}

async function getModules(id) {
    let modules = await Module.find({
        idFather: id
    }, '-idFather -__v -_id');
    let array = Object.keys(modules[0].toObject());
    return array.filter((currentKey) => {
        if (modules[0][currentKey]) {
            if (modules[0][currentKey].hasPermissionThisModule) {
                return (currentKey);
            }
        }
    });
}

async function getItems(idGroup) {
    return (await Item.find({
        idGroup: idGroup
    }));
}

async function getGroupsItems() {
    let groupItems = (await GroupItems.find().populate('items'));
    return groupItems;
}

async function create(userParam) {
    // validate
    // console.log('Dentro de create...');
    if (await User.findOne({
            username: userParam.username
        })) {
        // console.log('Datos a registrar: ', userParam);
        throw 'Username "' + userParam.username + '" is already taken';
    }
    /*const { modulesSelected, moduleMenu, ...userData } = userParam;
    modulesSelected.map((currentValue) => {
        module[currentValue].hasPermissionThisModule = true;
        // module[currentValue].accessToMenus = moduleMenu[currentValue].menu;
        moduleMenu[currentValue].menu.map(async(current, index) => {
            let menu = new Menu();
            menu.name = current;
            moduleMenu[currentValue].crud[index].map((data) => {
                menu[data] = true;
            });
            menu.idFather = module._id;
            module[currentValue].accessToMenus.push(menu._id);
            await menu.save();
        });
    });

    var user = new User(userData);
    user.accessToModules = module._id;
    module.idFather = user._id;
    await module.save();*/
    const user = new User(userParam);
    user.rol = 'Admin';
    // hash password
    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    }
    // save user
    await user.save((error) => {
        if (error) {
            console.log(error);
            throw (error);
        }
    });
}

async function addItem(id, itemParam) {
    if (await Item.findOne({
            descripcion: itemParam.descripcion
        })) {
        throw (`Ya Existe el Item ${itemParam.descripcion}`);
    } else {
        const item = new Item(itemParam);
        item.idGroup = id;
        await item.save((error) => {
            if (error) {
                throw (error);
            }
        });
    }
}

async function addGroupItems(groupParam, itemsParam) {
    if (await GroupItems.findOne({
            descripcion: groupParam.descripcion
        })) {
        throw (`Ya Existe el Grupo de Items ${groupItemsParam.descripcion}`);
    } else {
        const groupItems = await new GroupItems(groupParam);
        console.loasync

        function deleteCategoria(id) {
            await Categoria.findByIdAndRemove(id);
        }
        g(groupParam, itemsParam);
        await groupItems.save((error) => {
            if (error) {
                throw (error);
            }
        });
        await itemsParam.map(async (currentValue) => {
            await addItem(groupItems._id, currentValue);
        });
    }
}

async function update(id, userParam) {
    const user = await User.findById(id);

    // validate
    if (!user) throw 'User not found';

    if (user.username !== userParam.username && await User.findOne({
            username: userParam.username
        })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    // hash password if it was entered
    if (userParam.password) {
        userParam.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // copy userParam properties to user
    Object.assign(user, userParam);
    await user.save();
}

async function updateGroupItems(idGroupParam, groupParam) {
    console.log(idGroupParam, groupParam);
    await GroupItems.findById(idGroupParam, async (error, response) => {
        if (error) {
            throw (error);
        }
        if (
            (response.descripcion !== groupParam.descripcion) &&
            (await (Subcategoria.findOne({
                descripcion: groupParam.descripcion
            })))
        ) {
            throw (`Ya Existe una subcategoria con esta Descripcion: ${groupParam.descripcion}`);
        }
        if (response.descripcion !== groupParam.descripcion) {
            Object.assign(response, groupParam);
            response.save((error) => {
                if (error) {
                    throw (error);
                }
            });
        }

    });
}

async function updateItem(idParam, itemParam) {
    console.log('QlqDq');
    await Item.findById(idParam, async (error, response) => {
        if (error) {
            throw (error);
        }
        if (
            (response.descripcion !== itemParam.descripcion) &&
            (await (Subcategoria.findOne({
                descripcion: itemParam.descripcion
            })))
        ) {
            throw (`Ya Existe una subcategoria con esta Descripcion: ${itemParam.descripcion}`);
        }
        Object.assign(response, itemParam);
        response.save((error) => {
            if (error) {
                throw (error);
            }
        });
    });
}

async function logout(id, userParam) {

    var user = await User.findById(id);
    if (!user) {
        console.log('User not found');
        throw 'User not found';
    }
    user.loggedIn = false;
    user.accesToken = 'null';
    await user.save();
}

async function _delete(id) {
    await User.findByIdAndRemove(id);
}