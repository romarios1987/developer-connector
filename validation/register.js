const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
    let errors = {};

    data.name = !isEmpty(data.name) ? data.name : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.password_confirm = !isEmpty(data.password_confirm) ? data.password_confirm : '';

    // Checking Name
    if (!validator.isLength(data.name, {min: 2, max: 30})) {
        errors.name = 'Name must be between 2 and 30 characters';
    }
    if (validator.isEmpty(data.name)) {
        errors.name = 'Name field is required';
    }

    // Checking Email
    if (validator.isEmpty(data.email)) {
        errors.email = 'Email field is required';
    }
    if (!validator.isEmail(data.email)) {
        errors.email = 'Email is invalid';
    }


    // Checking Password
    if (validator.isEmpty(data.password)) {
        errors.password = 'Password field is required';
    }
    if (!validator.isLength(data.password, {min: 6, max: 30})) {
        errors.password = 'Password must be at least 6 characters';
    }

    // Checking Password Confirm
    if (validator.isEmpty(data.password_confirm)) {
        errors.password_confirm = 'Password Confirm field is required';
    }
    if (!validator.equals(data.password, data.password_confirm)) {
        errors.password_confirm = 'Passwords must match';
    }

    return {
        errors: errors,
        isValid: isEmpty(errors)
    }
};