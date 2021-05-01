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

userSchema.post('save', function (doc, next) {
    console.log('new user was created & saved', doc );
    next()
});

// fire a function before a doc is saved to the db

userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt); 
    next();
})

const User = mongoose.model('user', userSchema);

module.exports = User;
