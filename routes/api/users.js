const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const keys = require('../../config/keys');

// Load Input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// Load User model
const User = require('../../models/User');


// @route       GET api/users/test
// @description Tests users route
// @access      Public
router.get('/test', (req, res) => res.json({msg: 'Users works'}));


// @route       GET api/users/register
// @description Register user
// @access      Public
router.post('/register', (req, res) => {

    const {errors, isValid} = validateRegisterInput(req.body);

    // check validation
    if (!isValid) {
        // Return any errors with 400 status
        return res.status(400).json(errors)
    }

    User.findOne({email: req.body.email}).then(user => {
        if (user) {
            errors.email = 'Email already exists';
            return res.status(400).json(errors)
        } else {
            const avatar = gravatar.url(req.body.email, {s: '200', r: 'pg', d: 'mm'});

            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                avatar
            });

            // bcrypt hash password
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err));
                })
            })
        }
    });
});

// @route       GET api/users/login
// @description Login User / Returning JWT Token
// @access      Public


router.post('/login', (req, res) => {

    const {errors, isValid} = validateLoginInput(req.body);
    // check validation
    if (!isValid) {
        return res.status(400).json(errors)
    }


    const email = req.body.email;
    const password = req.body.password;

    // Find user by Email
    User.findOne({email: email})
        .then(user => {
            // Check for user
            if (!user) {
                errors.email = 'User not found';
                return res.status(404).json(errors);
            }
            // Check for password
            bcrypt.compare(password, user.password).then(isMatch => {
                if (isMatch) {

                    // User Matched

                    // create jwt Payload
                    const payload = {
                        id: user.id,
                        name: user.name,
                        avatar: user.avatar
                    };

                    // Sign Token
                    jwt.sign(
                        payload,
                        keys.secretOrKey,
                        {expiresIn: 3600},
                        (err, token) => {
                            res.json({
                                success: true,
                                token: `Bearer ${token}`
                            })
                        });

                    //res.json({msg: 'Success'})
                } else {
                    errors.password = 'Password incorrect';
                    return res.status(400).json(errors);
                }
            });
        });
});


// @route       GET api/users/current
// @description Return  current user
// @access      Private
router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {

    const {id, name, email, password} = req.user;

    res.json({id, name, email, password});
});

module.exports = router;