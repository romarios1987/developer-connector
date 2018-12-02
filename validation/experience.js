const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateExperienceInput(data) {
    let errors = {};

    data.title = !isEmpty(data.title) ? data.title : '';
    data.company = !isEmpty(data.company) ? data.company : '';
    data.from = !isEmpty(data.from) ? data.from : '';


    // Checking Title
    if (validator.isEmpty(data.title)) {
        errors.title = 'Job Title field is required';
    }

    // Checking Company
    if (validator.isEmpty(data.company)) {
        errors.company = 'Company field is required';
    }

    // Checking From Date
    if (validator.isEmpty(data.from)) {
        errors.from = 'From Date field is required';
    }

    return {
        errors: errors,
        isValid: isEmpty(errors)
    }
};