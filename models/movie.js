const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const { genreSchema } = require('./genre');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        trime: true,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    genre: {
        type: genreSchema, // independent of Joi Schema! Representation of Model
        required: true
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    }
});

const Movie = mongoose.model('Movie', movieSchema);

// What the client send us! Input to API

function validateMovie(movie) {
    const schema = Joi.object({
        title: Joi.string().min(3).max(50).required(),
        genreId: Joi.objectId().required(), // objectId is defined in main so that we don't need to define it elsewhere
        numberInStock: Joi.number().min(0).required(),
        dailyRentalRate: Joi.number().min(0).required()
    });
    return schema.validate(movie);
}

exports.validate = validateMovie;
exports.Movie = Movie;