const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = (req, res, next) => { // custom middleware is a function that will be called with the req, res and next as arguments.
    const token = req.cookies.jwt;
    // check json web token exists and is valid
    // you may have the token from the cookie alright, but you have to check that it has not been tampered with and is still valid, so we also have to validate the token
    if(token) {
        jwt.verify(token, 'fearless pilgrim', (err, decodedToken) => { // the callback function runs after the verification is done, and is passed an error(if there is one) and the decoded token(which is an object which contains the decoded payload information and some other info)
            if(err) {
                console.log(err.message);
                res.redirect('/login');
            } else {
                console.log(decodedToken);
                next(); // we continue to the next route handling function: when you use custom middleware, always call next() so that you continue to the next route handler function(which will probably send the user to the protected route or show some state changing data).
            }
        })
    }
    else {
        res.redirect('/login');
    }
}

// check current user middleware: This middleware is used to decode the payload information in the token(to get the user id) and use it to query the database to find that particular user, and then create a variable on the res.locals object, so that we can access that in our views and display that user's information in our views.

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, 'fearless pilgrim', async (err, decodedToken) => {
            if(err) {
                console.log(err);
                res.locals.user = null;
                next();
            } else {
                console.log(decodedToken)
                let user = await User.findById(decodedToken.id);
                res.locals.user = user; // we are creating a variable on res.locals(which is used to store local data that we can access in our views to inject dynamic data)
                next();
            }
        })
    } else {
        res.locals.user = null;
        next();
    }
  
}


module.exports = { requireAuth, checkUser };