const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');


// Load Input validation
const validatePostInput = require('../../validation/post');

// Load Profile model
const Profile = require('../../models/Profile');

// Load Post model
const Post = require('../../models/Post');


// @route       GET api/posts/test
// @description Tests posts route
// @access      Public
router.get('/test', (req, res) => res.json({msg: 'Posts works'}));


// @route       GET api/posts
// @description Get all posts
// @access      Public

router.get('/', (req, res) => {
    Post.find()
        .sort({date: -1})
        .then(posts => res.json(posts))
        .catch(() => res.status(404).json({no_posts_found: 'No posts found'}))
});


// @route       GET api/posts/:id
// @description Get post by id (Single post)
// @access      Public

router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(post => res.json(post))
        .catch(() => res.status(404).json({no_post_found: 'No post found with that ID'}))
});


// @route       POST api/posts
// @description Create post
// @access      Private

router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {

    const {errors, isValid} = validatePostInput(req.body);

    // check validation
    if (!isValid) {
        // Return any errors with 400 status
        return res.status(400).json(errors)
    }

    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id

    });

    newPost.save().then(post => res.json(post));

});


// @route       DELETE api/posts/:id
// @description Delete post
// @access      Private

router.delete('/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    Profile.findOne({user: req.user.id})
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    // Check post owner
                    if (post.user.toString() !== req.user.id) {
                        return res.status(401).json({not_authorized: 'User not authorized'})
                    }

                    // Delete
                    post.remove().then(() => res.json({success: true}))
                })
                .catch(() => res.status(404).json({no_post_found: 'No post found'}))
        })
});


module.exports = router;