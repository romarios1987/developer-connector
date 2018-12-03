const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePostInput(data) {
    let errors = {};

    data.text = !isEmpty(data.text) ? data.text : '';


    if (!validator.isLength(data.text, {min: 10, max: 350})) {
        errors.text = 'Post must be between 10 and 350 characters';
    }

    // Checking Text Field
    if (validator.isEmpty(data.text)) {
        errors.text = 'Text field is required';
    }


    return {
        errors: errors,
        isValid: isEmpty(errors)
    }
};