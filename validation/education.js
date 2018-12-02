const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateEducationInput(data) {
    let errors = {};

    data.school = !isEmpty(data.school) ? data.school : '';
    data.degree = !isEmpty(data.degree) ? data.degree : '';
    data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : '';
    data.from = !isEmpty(data.from) ? data.from : '';


    // Checking School
    if (validator.isEmpty(data.school)) {
        errors.school = 'School field is required';
    }

    // Checking Degree
    if (validator.isEmpty(data.degree)) {
        errors.degree = 'Degree field is required';
    }

    // Checking Fieldofstudy
    if (validator.isEmpty(data.fieldofstudy)) {
        errors.fieldofstudy = 'Fieldofstudy field is required';
    }

    // Checking From Date
    if (validator.isEmpty(data.from)) {
        errors.from = 'From Date field is required (Education)';
    }

    return {
        errors: errors,
        isValid: isEmpty(errors)
    }
};