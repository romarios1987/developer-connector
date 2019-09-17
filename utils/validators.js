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
exports.portfolioValidators = [
    body('status', 'Status is required')
        .not()
        .isEmpty(),
    body('skills', 'Skills is required')
        .not()
        .isEmpty()
];

exports.experienceValidators = [
    body('title', 'Title is required')
        .not()
        .isEmpty(),
    body('company', 'Company is required')
        .not()
        .isEmpty(),
    body('from', 'From date is required')
        .not()
        .isEmpty()
];


exports.educationValidators = [
    body('school', 'School is required')
        .not()
        .isEmpty(),
    body('degree', 'Degree is required')
        .not()
        .isEmpty(),
    body('fieldofstudy', 'Field of study is required')
        .not()
        .isEmpty(),
    body('from', 'From date is required')
        .not()
        .isEmpty(),
];


exports.postValidators = [
    body('text', 'Text post is required')
        .not()
        .isEmpty()
];

exports.commentValidators = [
    body('text', 'Text comment is required')
        .not()
        .isEmpty()
];
