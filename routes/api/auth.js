const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator');
const {loginValidators} = require('../../utils/validators');

const auth = require('../../middleware/auth');
const User = require('../../models/User');

/**
 * @route GET api/auth
 * @desc Test route
 * @access Public
 */
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});


/**
 * @route POST api/auth
 * @desc Authenticate user & get token
 * @access Public
 */
router.post('/', loginValidators, async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }
    const {email, password} = req.body;

    try {
        let user = await User.findOne({email});

        if (!user) {
            return res.status(422).json({errors: [{msg: 'Invalid credentials'}]});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(422).json({errors: [{msg: 'Invalid credentials'}]});
        }

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

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }

});




module.exports = router;