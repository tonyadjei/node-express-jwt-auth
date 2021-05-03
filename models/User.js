const mongoose = require('mongoose');
const { isEmail } = require('validator');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Minimum password length is 6 characters']
    }
});

// MONGOOSE HOOKS
// fire a function after a new user document has been saved to the db

userSchema.post('save', function (doc, next) { // inside the callback functions, we get access to the document that has been saved to the database and also a next() method for continuing the operation, otherwise the process will keep hanging.
    console.log('new user was created & saved', doc );
    next() // in mongoose hooks, you must also call next()
});

// fire a function before a doc is saved to the db

userSchema.pre('save', async function (next) { // for the callback functions in the 'pre' mongoose hooks, you only get access to the next function
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt); // the 'this' keyword here, references the local instance of the object created by the User model, before it is saved to the database.
    next(); // in mongoose hooks, you must also call next()
})

// static method to log in user ( we can create our own statics method on a model, just as by default the User model has User.create(), we can also add our own static methods to the model)
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email }); // here, the 'this' keyword is a reference to the User model.
    if(user) {
        const auth = await bcrypt.compare(password, user.password);
        if(auth) {
            return user
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email');
}

const User = mongoose.model('user', userSchema);

module.exports = User;
