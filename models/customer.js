const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    isGold: {
        type: Boolean,
        default: false,
        required: true
    },
    name: {
        type: String,
        minlength: 3,
        maxlength: 20,
        required: true
    },
    phone: {
        type: String,
        minlength: 3,
        maxlength: 12, // min/max are the values not the number of digits
        required: true
    }
});

const Customer = mongoose.model('Customer', customerSchema);

function validateCustomer(customer) {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        phone: Joi.string().min(3).required(),
        isGold: Joi.boolean()
    });
    return schema.validate(customer);
}


exports.Customer = Customer;
exports.validate = validateCustomer;
