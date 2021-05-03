const jwt = require('jsonwebtoken');

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


module.exports = { requireAuth };