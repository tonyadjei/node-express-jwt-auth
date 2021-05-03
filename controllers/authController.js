const User = require('../models/User');
const jwt = require('jsonwebtoken');

// handle errors
const handleErrors = (err) => {
    console.log(err.message, 'the code: ', err.code);
    let errors = { email: '', password: ''}
    console.log(err.errors)

    // incorrect email
    if(err.message === "incorrect email") {
        errors.email = 'incorrect email and/or password';
    }
    // incorrect password
    if(err.message === 'incorrect password') {
        errors.password = 'incorrect email and/or password';
    }

    // duplicate error code 
    if(err.code === 11000){
        errors.email = 'that email is already registered';
        return errors;
    }
    // validation errors
    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties}) => { //you have to add an extra parentheses when you are deconstructing an object and using that as your 'i' in your forEach()
            errors[properties.path] = properties.message;
        });
    }
    return errors;
}

// create jwt token

const maxAge = 3 * 24 * 60 * 60; // for jwt, the expiry date is in seconds, for cookies, it's in milliseconds
const createToken = (id) => {
    return jwt.sign({ id }, 'fearless pilgrim', { // we put the payload(which is an object) and then a secret(which we will hash together with the header and the payload to create the signature), and then an options object(which we can use to specify the period for which the jwt will be valid by using the expiresIn property ). The header is applied automatically.
        expiresIn: maxAge
    });
}

module.exports.signup_get = (req, res) => {
    res.render('signup');
}

module.exports.login_get = (req, res) => {
    res.render('login');
}

module.exports.signup_post = async (req, res) => {
    const { email, password } = req.body;
    // note: when we use async and await to perform asynchronous codes, we cannot use the 'catch()' method to catch errors, instead, we need to surround our await statements in a try...catch block
    try {
        const user = await User.create({email, password}); // we get back the new document that has been stored in the database and we are storing it in the 'user' variable.
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ user: user._id });
    }
    catch(err) {
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}

module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user: user._id });
    }
    catch(err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }

}