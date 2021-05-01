const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser'); //3rd party middleware package to help us create cookies and also get cookies from the requests(when a browser has a cookie in its storage, anytime it makes a request, it sends the cookie data along with that request so that the server side can access it)

const app = express();

// middleware
app.use(express.static('public'));
// using the express json parser middleware. it converts any json data we get from a request into a javascript object and attaches it to the req object
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb+srv://tonygrace:Tonyadjei2402@nodejs.4fw0l.mongodb.net/node-auth';
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));

// routes

app.get('/', (req,res) => res.render('home'));
app.get('/smoothies', (req, res) => res.render('smoothies'));
app.use(authRoutes);

// routes for testing cookies

app.get('/set-cookies', (req, res) => {
    // res.setHeader('Set-Cookie', 'newUser=true');
    res.cookie('newUser', false);
    res.cookie('isEmployee', true, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true }); //maxAge is the expiring data for the cookie, it should be in milliseconds. the secure property ensures that the cookie is sent only if we have an https connection, httpOnly property means that we can only access the cookie via http requests, if we try to access it on the frontend by saying 'document.cookie', we won't see it there. set these properties in production
    res.send('you got the cookies!');

});

app.get('/read-cookies', (req, res) => {
    const cookies = req.cookies;
    console.log(cookies);
    res.json(cookies);

});