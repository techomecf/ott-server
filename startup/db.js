const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config');

module.exports = function () {
    const dbURI = config.get('db');
    mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(() => winston.info(`Connected to '${dbURI}'`))
}