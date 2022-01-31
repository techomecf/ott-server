const Joi = require('@hapi/joi');
const config = require('config');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 15
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 4,
        maxlength: 30
    },
    password: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 1024
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

userSchema.methods.generateAuthToken = function(){
    return jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
}

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().required().min(3),
        email: Joi.string().required().min(3).email(),
        password: Joi.string().required().min(3),
        isAdmin: Joi.boolean()
    });

    return schema.validate(user);
}

exports.validate = validateUser;
exports.User = User;