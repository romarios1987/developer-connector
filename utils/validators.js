const {body} = require('express-validator');

exports.registerValidators = [
    body('name', 'Name must have more than 3 characters')
        .isLength({min: 3, max: 25})
        .trim(),
    body('email', 'Please include a valid email')
        .isEmail()
        .normalizeEmail(),
    body('password', 'Your password must be at least 6 characters')
        .isLength({min: 6, max: 50})
        .isAlphanumeric().withMessage('Name must be alphabet letters and numeric.')
        .trim()
];

exports.loginValidators = [
    body('email', 'Please include a valid email')
        .isEmail()
        .normalizeEmail(),
    body('password', 'Your password must be at least 6 characters')
        .isLength({min: 6, max: 50})
        .isAlphanumeric().withMessage('Name must be alphabet letters and numeric.')
        .trim()
];