const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const registerValidation = require('../../validation/register');
const loginValidation = require('../../validation/login');
const User = require('../../models/User');
const Game = require('../../models/Game');
const Collection = require('../../models/Collection');
const ProfileComment = require("../../models/ProfileComment")
const PasswordRecovery = require('../../models/PasswordRecovery');
require('dotenv').config();

router.get('/search/:name', (req, res) => {
    User.find({ 'name': { $regex: '.*' + req.params.name + '.*', $options: 'i' } })
        .then(((users) => {
            res.status(200).json(users);
        }))
        .catch((err) => {
            res.status(500).json(err);
        });
});

router.get('/getByName/:name', (req, res) => {
    User.findOne({
        name: req.params.name,
    })
        .populate({
            path: 'gameCollection',
            populate: {
                path: 'reviews',
                select: 'rating'
            },
        })
        .populate({
            path: 'wishlist',
            populate: {
                path: 'reviews',
                select: 'rating'
            }
        })
        .populate({
            path: 'profileComments',
            populate: {
                path: 'commenter'
            }
        })
        .then((user) => {
            if (user) {
                res.json({
                    user: user,
                });
            } else {
                return res
                    .status(400)
                    .json({ message: 'Failed to find user.' });
            }
        });
});

router.post("/addComment", (req, res) => {

    const newComment = new ProfileComment({
        commenter: req.body.commenterId,
        text: req.body.comment,
        timestamp: req.body.timestamp
    })

    newComment.save().then(savedComment => {
        User.findByIdAndUpdate(req.body.commentReceiverId, { $push: { profileComments: savedComment._id } })
            .then(() => {
                User.findOne({ _id: req.body.commentReceiverId })
                    .populate({
                        path: 'profileComments',
                        populate: {
                            path: 'commenter',
                        },
                    })
                    .then((data) => {
                        res.status(200).json(data.profileComments);
                    });
            });
    });
})


/**
 * @route GET api/users/getForrPasswordRecovery
 * @desc Retrieves password recovery options for user
 */
router.get('/getForPasswordRecovery/:email', (req, res) => {
    User.findOne({
        email: req.params.email,
    })
        .populate({
            path: 'passwordrecovery',
            populate: {
                path: 'question',
            },
        })
        .then((user) => {
            if (!user) {
                return res
                    .status(400)
                    .json({ message: 'Failed to find user.' });
            }

            const passwordRecoveryData = user.passwordrecovery.map((item) => {
                return {
                    text: item.question.text,
                    answer: item.answer,
                };
            });

            res.json(passwordRecoveryData);
        });
});

/**
 * @route POST api/users/register
 * @desc Register operations for user
 * @access Public
 */
router.post('/register', (req, res) => {
    const { errors, isValid } = registerValidation(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({
        email: req.body.email,
    }).then((user) => {
        if (user) {
            return res.status(400).json({ email: 'Email already exists.' });
        } else {
            const passwordRecovery1 = new PasswordRecovery({
                question: req.body.recoveryQuestion1ID,
                answer: req.body.recoveryQuestion1Answer,
            });

            const passwordRecovery2 = new PasswordRecovery({
                question: req.body.recoveryQuestion2ID,
                answer: req.body.recoveryQuestion2Answer,
            });

            passwordRecovery1.save().then((recovery1) => {
                passwordRecovery2.save().then((recovery2) => {
                    const newUser = new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password,
                        passwordrecovery: [recovery1._id, recovery2._id],
                    });

                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;
                            newUser
                                .save()
                                .then((user) => {
                                    res.json(user);
                                })
                                .catch((err) => console.log(err));
                        });
                    });
                });
            });
        }
    });
});

router.post('/updatePassword', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email }).then((user) => {
        if (!user) {
            res.status(400).json('User not found.');
        }

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
                if (err) throw err;
                user.password = hash;

                user.save();
                return res.status(200).json('Success');
            });
        });
    });
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post('/login', (req, res) => {
    // Form validation
    const { errors, isValid } = loginValidation(req.body);
    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const email = req.body.email;
    const password = req.body.password;
    // Find user by email
    User.findOne({ email })
        .populate({
            path: 'role',
        })
        .then((user) => {
            // Check if user exists
            if (!user) {
                return res.status(404).json({ emailnotfound: 'Email not found' });
            }
            // Check password
            bcrypt.compare(password, user.password).then((isMatch) => {
                if (isMatch) {
                    // User matched
                    // Create JWT Payload
                    const payload = {
                        id: user.id,
                        name: user.name,
                        role: user.role.name,
                        profilePicture: user.profilepicture,
                    };
                    // Sign token
                    jwt.sign(
                        payload,
                        process.env.JWTSECRET,
                        {
                            expiresIn: 31556926, // 1 year in seconds
                        },
                        (err, token) => {
                            res.json({
                                success: true,
                                token: 'Bearer ' + token,
                            });
                        },
                    );
                } else {
                    return res
                        .status(400)
                        .json({ passwordincorrect: 'Password incorrect' });
                }
            });
        });
});

module.exports = router;
