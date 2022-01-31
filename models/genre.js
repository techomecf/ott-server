const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 20
    }
}, {
    versionKey: false
});

const Genre = mongoose.model('Genre', genreSchema);

function validateGenre(genre) {
    const schema = Joi.object({
        name: Joi.string()
            .min(5)
            .max(20)
            .required()
    });
    return schema.validate(genre);
}

exports.Genre = Genre;
exports.validate = validateGenre;
exports.genreSchema = genreSchema;