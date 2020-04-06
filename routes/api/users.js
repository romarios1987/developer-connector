const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const {validationResult} = require('express-validator');
const {registerValidators} = require('../../utils/validators');


const User = require('../../models/User');


/**
 * @route POST api/users
 * @desc Register user
 * @access Public
 */
router.post('/', registerValidators, async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }
    const {name, email, password} = req.body;

    try {

        let user = await User.findOne({email});
        // See if user exists
        if (user) {
            return res.status(422).json({errors: [{msg: 'User already exists'}]});
        }

        // Get User gravatar
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        });

        user = new User({
            name, email, avatar, password
        });

        // Encrypt password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();


        // Return jsonwebtoken
        const payload = {
            user: {
                id: user.id
            }
        };
        jwt.sign(
            payload,
            config.get('jwtSecret'),
            {expiresIn: 60 * 60},
            (err, token) => {
                if (err) throw err;
                res.json({token})
            });

        // res.send('User Register')
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }

});

module.exports = router;