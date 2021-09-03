const userService = require('../services/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { TOKEN_SECRET } = require('../config');

function createToken(userData){
    const userViewModel = {
        _id: userData._id,
        email: userData.email,
        username: userData.username
    };

    const token = jwt.sign(userViewModel, TOKEN_SECRET);
    return token;
}

async function register(username, email, password){

    if(!username){
        throw new Error('Username is required!');
    }

    if(!email){
        throw new Error('Email is required!');
    }

    if(!password){
        throw new Error('Password is required!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const user = await userService.createUser(username, email, hashedPassword);
        return {
            _id: user._id,
            username: user.username,
            email: user.email,
            accessToken: createToken(user)
        };
    } catch (err) {
        console.error(err.message);
        throw err;
    }
};

async function login(email, password){
    if(!email){
        throw new Error('Email is required!');
    }

    if(!password){
        throw new Error('Password is required!');
    }


    const user = await userService.getUserByEmail(email);
    if(!user){
        const err = new Error('Wrong email or password!');
        err.status = 401;
        throw err;
    }

    const isMatching = await bcrypt.compare(password, user.hashedPassword);

    if(!isMatching){
        const err = new Error('Wrong email or password!');
        err.status = 401;
        throw err;
    } else {
        return {
            _id: user._id,
            username: user.username,
            email: user.email,
            accessToken: createToken(user)
        };
    }
}

module.exports = {
    auth: () => (req, res, next) => {
        const token = req.headers['x-authorization'];
        if(token){
            try {
                const userData = jwt.verify(token, TOKEN_SECRET);
                req.user = userData;
            } catch (err) {
                return res.status(401).json({ message: 'Please sign-in!' });
            }
        }
    
        req.auth = {
            register,
            login
        };
    
        next();
    },
    createToken
}