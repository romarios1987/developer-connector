const express = require('express');
const router = express.Router();
const request = require('request');
const config = require('config');
const auth = require('../../middleware/auth');
const {validationResult} = require('express-validator');
const {portfolioValidators, experienceValidators, educationValidators} = require('../../utils/validators');

const Profile = require('../../models/Profile');
const User = require('../../models/User');


/**
 * @route GET api/profile/me
 * @desc Get current users profile
 * @access Private
 */
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile
            .findOne({user: req.user.id})
            .populate('user', ['name', 'avatar']);

        if (!profile) {
            return res.status(422).json({msg: 'There is no profile for this user'})
        }

        res.json(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});


/**
 * @route POST api/profile
 * @desc Create or Update user profile
 * @access Private
 */
router.post('/', auth, portfolioValidators, async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }
    const {
        company,
        website,
        location,
        status,
        skills,
        githubusername,
        bio,
        youtube,
        facebook,
        linkedin,
        twitter,
        instagram,
    } = req.body;


    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;

    if (bio) profileFields.bio = bio;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;

    // Skills - Split into array
    if (skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim());
    }

    // Build socials object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;


    try {
        let profile = await Profile.findOne({user: req.user.id});

        if (profile) {
            //=== Update
            profile = await Profile.findOneAndUpdate(
                {user: req.user.id},
                {$set: profileFields},
                {new: true}
            );
            return res.json(profile);
        }

        //=== Create
        profile = new Profile(profileFields);
        await profile.save();
        res.json(profile)

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});


/**
 * @route GET api/profile
 * @desc Get all profiles
 * @access Public
 */
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile
            .find()
            .populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


/**
 * @route GET api/profile/user/:id
 * @desc Get profile bby user ID
 * @access Public
 */
router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile
            .findOne({user: req.params.user_id})
            .populate('user', ['name', 'avatar']);

        if (!profile) {
            return res.status(400).json({msg: 'There is no profile for this user'})
        }
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({msg: 'Profile not found'})
        }
        res.status(500).send('Server Error');
    }
});


/**
 * @route DELETE api/profile
 * @desc Delete profile, user & post
 * @access Private
 */
router.delete('/', auth, async (req, res) => {
    try {

        // Remove profile
        await Profile.findOneAndRemove({user: req.user.id});

        // Remove user
        await User.findOneAndRemove({_id: req.user.id});

        res.json({'msg': 'User deleted'})

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});


/**
 * @route PUT api/profile/experience
 * @desc Add profile experience
 * @access Private
 */
router.put('/experience', auth, experienceValidators, async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }


    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body;


    const newExperience = {
        title,
        company,
        from,
        location,
        to,
        current,
        description
    };

    try {
        let profile = await Profile.findOne({user: req.user.id});
        profile.experience.unshift(newExperience);

        await profile.save();
        res.json(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});


/**
 * @route DELETE api/profile/experience/:exp_id
 * @desc Delete experience from profile
 * @access Private
 */
router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {

        const profile = await Profile.findOne({user: req.user.id});

        // Get remove index
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

        profile.experience.splice(removeIndex, 1);

        await profile.save();

        res.json(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});


/**
 * @route PUT api/profile/education
 * @desc Add profile education
 * @access Private
 */
router.put('/education', auth, educationValidators, async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }

    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body;


    const newEducation = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    };

    try {
        let profile = await Profile.findOne({user: req.user.id});
        profile.education.unshift(newEducation);

        await profile.save();
        res.json(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});


/**
 * @route DELETE api/profile/education/:edu_id
 * @desc Delete education from profile
 * @access Private
 */
router.delete('/education/:edu_id', auth, async (req, res) => {
    try {

        const profile = await Profile.findOne({user: req.user.id});

        // Get remove index
        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.exp_id);

        profile.education.splice(removeIndex, 1);

        await profile.save();

        res.json(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});


/**
 * @route GET api/profile/github/:username
 * @desc Get user repos from github
 * @access Public
 */
router.get('/github/:username', (req, res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&
            sort=created:asc&
            client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
            method: 'GET',
            headers: {'user-agent': 'node.js'}
        };

        request(options, (error, response, body) => {
            if (error) console.error(error);

            if (response.statusCode !== 200) {
                return res.status(404).json({msg: 'No GitHub profile found'})
            }

            res.json(JSON.parse(body));
        })

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

module.exports = router;