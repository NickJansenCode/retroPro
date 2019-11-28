// NPM IMPORTS //
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// VALIDATION IMPORTS //
const registerValidation = require('../../validation/register');
const loginValidation = require('../../validation/login');
const promoteUserValidation = require("../../validation/promoteUser")
const banRemoveUserValidation = require("../../validation/banRemoveUser")
const listValidation = require("../../validation/list");

// MODEL IMPORTS //
const User = require('../../models/User');
const Role = require("../../models/Role")
const List = require("../../models/List");
// eslint-disable-next-line no-unused-vars
const Game = require('../../models/Game');
// eslint-disable-next-line no-unused-vars
const ProfileComment = require("../../models/ProfileComment")
const PasswordRecovery = require('../../models/PasswordRecovery');
const GameComment = require("../../models/GameComment")
const Review = require("../../models/Review")
const UserReport = require("../../models/UserReport")
const Friendship = require("../../models/Friendship")

/**
 * Express router to mount user related actions on.
 * @type {express.Router}
 * @const
 * @namespace routes/api/users
 */
const router = express.Router();

//........................................................................................................................
//.....GGGGGGG....EEEEEEEEEEE.TTTTTTTTTTT.....RRRRRRRRRR.....OOOOOOO.....UUUU...UUUU..TTTTTTTTTTEEEEEEEEEEEE..SSSSSSS.....
//...GGGGGGGGGG...EEEEEEEEEEE.TTTTTTTTTTT.....RRRRRRRRRRR...OOOOOOOOOO...UUUU...UUUU..TTTTTTTTTTEEEEEEEEEEEE.SSSSSSSSS....
//..GGGGGGGGGGGG..EEEEEEEEEEE.TTTTTTTTTTT.....RRRRRRRRRRR..OOOOOOOOOOOO..UUUU...UUUU..TTTTTTTTTTEEEEEEEEEEEE.SSSSSSSSSS...
//..GGGGG..GGGGG..EEEE...........TTTT.........RRRR...RRRRR.OOOOO..OOOOO..UUUU...UUUU.....TTTT....EEEE.......ESSSS..SSSS...
//.GGGGG....GGG...EEEE...........TTTT.........RRRR...RRRRRROOOO....OOOOO.UUUU...UUUU.....TTTT....EEEE.......ESSSS.........
//.GGGG...........EEEEEEEEEE.....TTTT.........RRRRRRRRRRR.ROOO......OOOO.UUUU...UUUU.....TTTT....EEEEEEEEEE..SSSSSSS......
//.GGGG..GGGGGGGG.EEEEEEEEEE.....TTTT.........RRRRRRRRRRR.ROOO......OOOO.UUUU...UUUU.....TTTT....EEEEEEEEEE...SSSSSSSSS...
//.GGGG..GGGGGGGG.EEEEEEEEEE.....TTTT.........RRRRRRRR....ROOO......OOOO.UUUU...UUUU.....TTTT....EEEEEEEEEE.....SSSSSSS...
//.GGGGG.GGGGGGGG.EEEE...........TTTT.........RRRR.RRRR...ROOOO....OOOOO.UUUU...UUUU.....TTTT....EEEE..............SSSSS..
//..GGGGG....GGGG.EEEE...........TTTT.........RRRR..RRRR...OOOOO..OOOOO..UUUU...UUUU.....TTTT....EEEE.......ESSS....SSSS..
//..GGGGGGGGGGGG..EEEEEEEEEEE....TTTT.........RRRR..RRRRR..OOOOOOOOOOOO..UUUUUUUUUUU.....TTTT....EEEEEEEEEEEESSSSSSSSSSS..
//...GGGGGGGGGG...EEEEEEEEEEE....TTTT.........RRRR...RRRRR..OOOOOOOOOO....UUUUUUUUU......TTTT....EEEEEEEEEEE.SSSSSSSSSS...
//.....GGGGGGG....EEEEEEEEEEE....TTTT.........RRRR....RRRR....OOOOOO.......UUUUUUU.......TTTT....EEEEEEEEEEE..SSSSSSSS....
//........................................................................................................................

/**
 * @route GET /api/users/search/:id
 * @desc Route serving user search functionality. Searches for and returns
 * user records based on their names or the tags that they have applied to 
 * their profile.
 * @returns User records. @see User
 */
router.get('/search/:name', (req, res) => {
    User.find({ $or: [{ 'name': { $regex: '.*' + req.params.name + '.*', $options: 'i' } }, { 'tags': { $regex: req.params.name, $options: 'i' } }] })
        .then(((users) => {
            res.status(200).json(users);
        }))
        .catch((err) => {
            res.status(500).json(err);
        });
});

/**
 * @route GET /api/users/getSettings/:id
 * @desc Route serving a GET request for user's profile settings. Finds a user
 * by their _id and returns the user's privacy setting and the tags they have
 * applied to their profile.
 * @returns A user's boolean privateAccount value, and the user's string[] of tags 
 */
router.get('/getSettings/:id', (req, res) => {
    User.findOne({ _id: req.params.id })
        .then(user => {
            res.status(200).json({
                privateAccount: user.private,
                tags: user.tags,
            })
        })
})

/**
 * @route GET /api/users/loadCollection/:id
 * @desc Route serving a GET request for loading a user's 
 * game collection.
 * @returns A gameCollection record. @see Collection
 */
router.get("/loadCollection/:userID", (req, res) => {
    User.findOne({ _id: req.params.userID })
        .populate({
            path: "gameCollection",
        })
        .then(user => {
            return res.status(200).json(user.gameCollection)
        })
})

/**
 * @route GET /api/users/getForrPasswordRecovery/:email
 * @desc Route serving a GET request for loading a user's
 * password recovery questions and answers.
 * @returns Two password recovery documents. @see PasswordRecovery
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
 * @route GET /api/users/getAuthUserProfilePicture/:id
 * @desc Route serving a GET request for loading the currently 
 * logged in user's profile picture.
 * @returns The image URL of the user's profile picture.
 */
router.get("/getAuthUserProfilePicture/:id", (req, res) => {
    User.findOne({ _id: req.params.id })
        .then((user) => {
            res.status(200).json(user.profilepicture)
        })
})

/**
 * @route GET /api/users/getList/:listID
 * @desc Route serving a GET request for loading a List
 * document's contents.
 * @returns A List document. @see List
 */
router.get("/getList/:listID", (req, res) => {
    List.findOne({
        _id: req.params.listID
    })
        .populate({
            path: "items",
            populate: {
                path: "reviews",
                select: "rating"
            }
        })
        .then(list => {
            res.status(200).json({
                listName: list.name,
                listDescription: list.description,
                items: list.items
            })
        })
})

/**
 * @route GET /api/users/isUserAdmin/:id
 * @desc Route serving a GET request for determining if a user
 * is an admin.
 * @returns Boolean whether or not the user is an admin.
 */
router.get("/isUserAdmin/:id", (req, res) => {
    User.findOne({
        _id: req.params.id
    })
        .populate("role")
        .then(user => {
            if (user.role.name == "Admin") {
                return res.status(200).json(true)
            }
            return res.status(200).json(false)
        })
})

/**
 * @route GET /api/users/isUserBannedOrDeleted/:id
 * @desc Route serving a GET request for determining if a user
 * is banned or has had their account deleted.
 * @returns Boolean whether or not the user is banned or deleted.
 */
router.get("/isUserBannedOrDeleted/:id", (req, res) => {
    User.findOne({
        _id: req.params.id
    })
        .then(user => {
            if (!user || user.isbanned) {
                return res.status(200).json(true)
            }
            return res.status(200).json(false)
        })
})



//...................................................................................................................................
//.PPPPPPPPP.....OOOOOOO......SSSSSSS....STTTTTTTTTT..... RRRRRRRRR.....OOOOOOO.....OUUU...UUUU..UTTTTTTTTTTTEEEEEEEEEE..SSSSSSS.....
//.PPPPPPPPPP...OOOOOOOOOO...OSSSSSSSS...STTTTTTTTTT..... RRRRRRRRRR...OOOOOOOOOO...OUUU...UUUU..UTTTTTTTTTTTEEEEEEEEEE.ESSSSSSSS....
//.PPPPPPPPPPP.POOOOOOOOOOO..OSSSSSSSSS..STTTTTTTTTT..... RRRRRRRRRR..ROOOOOOOOOOO..OUUU...UUUU..UTTTTTTTTTTTEEEEEEEEEE.ESSSSSSSSS...
//.PPPP...PPPP.POOOO..OOOOO.OOSSS..SSSS.....TTTT......... RRR...RRRRR.ROOOO..OOOOO..OUUU...UUUU.....TTTT....TEEE.......EESSS..SSSS...
//.PPPP...PPPPPPOOO....OOOOOOOSSS...........TTTT......... RRR...RRRRRRROOO....OOOOO.OUUU...UUUU.....TTTT....TEEE.......EESSS.........
//.PPPPPPPPPPPPPOO......OOOO.OSSSSSS........TTTT......... RRRRRRRRRR.RROO......OOOO.OUUU...UUUU.....TTTT....TEEEEEEEEE..ESSSSSS......
//.PPPPPPPPPP.PPOO......OOOO..SSSSSSSSS.....TTTT......... RRRRRRRRRR.RROO......OOOO.OUUU...UUUU.....TTTT....TEEEEEEEEE...SSSSSSSSS...
//.PPPPPPPPP..PPOO......OOOO....SSSSSSS.....TTTT......... RRRRRRR....RROO......OOOO.OUUU...UUUU.....TTTT....TEEEEEEEEE.....SSSSSSS...
//.PPPP.......PPOOO....OOOOO.......SSSSS....TTTT......... RRR.RRRR...RROOO....OOOOO.OUUU...UUUU.....TTTT....TEEE..............SSSSS..
//.PPPP........POOOO..OOOOO.OOSS....SSSS....TTTT......... RRR..RRRR...ROOOO..OOOOO..OUUU...UUUU.....TTTT....TEEE.......EESS....SSSS..
//.PPPP........POOOOOOOOOOO.OOSSSSSSSSSS....TTTT......... RRR..RRRRR..ROOOOOOOOOOO..OUUUUUUUUUU.....TTTT....TEEEEEEEEEEEESSSSSSSSSS..
//.PPPP.........OOOOOOOOOO...OSSSSSSSSS.....TTTT......... RRR...RRRRR..OOOOOOOOOO....UUUUUUUUU......TTTT....TEEEEEEEEEE.ESSSSSSSSS...
//.PPPP...........OOOOOO......SSSSSSSS......TTTT......... RRR....RRRR....OOOOOO.......UUUUUUU.......TTTT....TEEEEEEEEEE..SSSSSSSS....
//...................................................................................................................................

/**
 * @route POST /api/users/addGameToHighlights
 * @desc Route serving a POST request to add a game to the requesting user's
 * highlights field.
 * @returns The requesting user's highlights after adding the new
 * item.
 */
router.post("/addGameToHighlights", (req, res) => {
    User.findByIdAndUpdate(req.body.userID, { $push: { highlights: req.body.gameID } })
        .then(user => {
            User.findById(user._id)
                .populate({
                    path: 'highlights',
                    populate: {
                        path: 'platform'
                    }
                })
                .then(popUser => {
                    res.json(popUser.highlights)
                })

        })
})

/**
 * @route POST /api/users/removeGameFromHighlights
 * @desc Route serving a POST request to remove a game from the
 * requesting user's highlights field.
 * @returns The requesting user's highlights after removing the item.
 */
router.post("/removeGameFromHighlights", (req, res) => {
    User.findByIdAndUpdate(req.body.userID, { $pull: { highlights: req.body.gameID } })
        .then(user => {
            User.findById(user._id)
                .populate({
                    path: 'highlights',
                    populate: {
                        path: 'platform'
                    }
                })
                .then(popUser => {
                    res.json(popUser.highlights)
                })

        })
})

/**
 * @route POST /api/users/removeGameFromWishlist
 * @desc Route serving a POST request to remove a game from the
 * requesting user's wishlist field.
 * @returns The requesting user's wishlist after removing the item.
 */
router.post("/removeGameFromWishlist", (req, res) => {
    User.findByIdAndUpdate(req.body.userID, { $pull: { wishlist: req.body.gameID } })
        .then(user => {
            User.findById(user._id)
                .populate({
                    path: 'wishlist',
                    populate: {
                        path: 'reviews',
                        select: 'rating'
                    }
                })
                .then(popUser => {
                    res.json(popUser.wishlist)
                })

        })
})

/**
 * @route POST /api/users/sendFriendRequest
 * @desc Route serving a POST request to send a friend request
 * from one user to another.
 * @returns Boolean success.
 */
router.post("/sendFriendRequest", (req, res) => {
    const newFriendRequest = new Friendship({
        friendA: req.body.requesterID,
        friendB: req.body.requestedID
    })

    newFriendRequest.save().then(value => {
        return res.status(200).json(value != null)
    })
})

/**
 * @route POST /api/users/register
 * @desc Route serving a POST request to create a new User document 
 * (register a new user).
 * @returns The newly created user document.
 */
router.post('/register', (req, res) => {
    const { errors, isValid } = registerValidation(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({
        name: req.body.name,
    })
        .then(user => {
            if (user) {
                return res.status(400).json({ name: 'Name already exists.' })
            }
            else {
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
            }
        })

});

/**
 * @route POST /api/users/updatePassword
 * @desc Route serving a POST request for a user to update their password.
 * @returns Boolean success.
 */
router.post('/updatePassword', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email }).then((user) => {
        if (!user) {
            return res.status(400).json('User not found.');
        }

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
                if (err) throw err;
                user.password = hash;

                user.save().then(() => {
                    return res.status(200).json('Success');
                })
            });
        });
    });
});

/**
 * @route POST /api/users/login
 * @desc Route serving a POST request for a user to log in.
 * @returns Boolean success and a signed JWT token.
 */
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

            if (user.isbanned) {
                return res.status(401).json({ banned: "User is banned" })
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
                        // eslint-disable-next-line no-undef
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

/**
 * @route POST /api/users/updateUser
 * @desc Route serving a POST request to update the
 * requesting user's profile settings.
 * @returns The user's profile information.
 */
router.post("/updateUser", (req, res) => {
    User.findByIdAndUpdate(req.body.userId, { profilepicture: req.body.profilePictureURL, about: req.body.about, headerpicture: req.body.headerImageURL }).then(() => {

        User.findOne({ _id: req.body.userId })
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
                path: 'highlights', populate: { path: 'platform' }
            })
            .populate({
                path: 'profileComments',
                populate: {
                    path: 'commenter'
                }
            })
            .then((data) => {
                res.status(200).json({ "user": data });
            });

    })
})

/**
 * @route POST /api/users/addComment
 * @desc Route serving a POST request to add a comment
 * on a user's profile.
 * @returns The comments for the user's profile after adding the new comment.
 */
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
 * @route POST /api/users/saveSettings
 * @desc Route serving a POST request to update the requesting
 * user's privacy setting.
 * @returns Boolean success.
 */
router.post("/saveSettings", (req, res) => {
    User.findOneAndUpdate({ _id: req.body.userID }, { private: req.body.privateAccount }).then(() => {
        res.json(true)
    })
})

/**
 * @route POST /api/users/addTag
 * @desc Route serving a POST request to add a tag to the
 * requesting user's tags field.
 * @returns Boolean success
 */
router.post("/addTag", (req, res) => {
    User.findByIdAndUpdate(req.body.userID, { $push: { tags: req.body.tag } })
        .then(() => {
            res.json(true)
        })
})

/**
 * @route POST /api/users/removeTag
 * @desc Route serving a POST request to remove a tag from
 * the requesting user's tags field.
 * @returns Boolean success.
 */
router.post("/removeTag", (req, res) => {
    User.findByIdAndUpdate(req.body.userID, { $pull: { tags: req.body.tag } })
        .then(() => {
            res.json(true)
        })
})

/**
 * @route POST /api/users/getByName
 * @desc Route serving a POST request to get a user's profile information
 * by their name.
 * @returns All of the necessary information to display a user's profile.
 */
router.post('/getByName', (req, res) => {
    User.findOne({
        name: req.body.name,
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
        .populate({
            path: 'highlights',
            populate: {
                path: 'platform'
            }
        })
        .populate({
            path: "lists",
            populate: {
                path: "items"
            }
        })
        .then((user) => {
            if (user) {

                Friendship.find({ $or: [{ friendA: user._id, pending: false }, { friendB: user._id, pending: false }] })
                    .populate('friendA')
                    .populate('friendB')
                    .then((friendships) => {
                        Friendship.findOne({ $or: [{ friendA: req.body.authID, friendB: user._id }, { friendA: user._id, friendB: req.body.authID }] }).then(friendship => {
                            let friendshipStatus = ""
                            if (friendship) {

                                // You are friends. //
                                if (friendship.pending == false) {
                                    friendshipStatus = "Friends"
                                }
                                else {

                                    // If you requested them and it's still pending. //
                                    if (friendship.friendA == req.body.authID) {
                                        friendshipStatus = "Pending"
                                    }

                                    // If they requested you and it's still pending. //
                                    else {
                                        friendshipStatus = "PendingAccept"
                                    }
                                }

                                res.json({
                                    friends: friendships,
                                    friendshipStatus: friendshipStatus,
                                    user: user,
                                });

                            } else {

                                res.json({
                                    friends: friendships,
                                    friendshipStatus: friendshipStatus,
                                    user: user,
                                });
                            }
                        })
                    })

            } else {
                return res
                    .status(400)
                    .json({ message: 'Failed to find user.' });
            }
        });
});

/**
 * @route POST /api/users/promoteUser
 * @desc Route serving a POST request to promote a user account to administrator.
 * @returns Boolean success.
 */
router.post("/promoteUser", (req, res) => {
    const { errors, isValid } = promoteUserValidation(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({
        name: req.body.name
    })
        .then(user => {
            if (!user) {
                return res.status(400).json({ promoteName: `User with name ${req.body.name} does not exist` })
            }

            // Should never fail. //
            Role.findOne({
                name: "Admin"
            })
                .then(role => {
                    if (role._id.equals(user.role)) {
                        return res.status(400).json({ promoteName: `User with name ${req.body.name} is already an admin` })
                    }

                    user.role = role._id;

                    user.save().then(() => {
                        return res.status(200).json("Success")
                    })

                })
        })
})

/**
 * @route POST /api/users/banUser
 * @desc Route serving a POST request to ban a user.
 * @returns Boolean success.
 */
router.post("/banUser", (req, res) => {
    const { errors, isValid } = banRemoveUserValidation(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({
        name: req.body.name
    })
        .then((user) => {
            if (!user) {
                return res.status(400).json({ banRemoveName: `User with name ${req.body.name} does not exist` })
            }
            else if (user.isbanned) {
                return res.status(400).json({ banRemoveName: `User with name ${req.body.name} is already banned` })
            }

            removeUserPresence(user._id).then((result) => {
                if (result == true) {
                    user.isbanned = true
                    user.save().then(() => {
                        res.status(200).json("Success")
                    })
                }
            })
        })
})

/**
 * @route POST /api/users/deleteUser
 * @desc Route serving a POST request to delete a user account.
 * @returns Boolean success.
 */
router.post("/deleteUser", (req, res) => {
    const { errors, isValid } = banRemoveUserValidation(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({
        name: req.body.name
    })
        .then(async (user) => {
            if (!user) {
                return res.status(400).json({ banRemoveName: `User with name ${req.body.name} does not exist` })
            }

            removeUserPresence(user._id).then(() => {
                user.remove().then(() => {
                    res.status(200).json("Success")
                })
            })

        })
})

/**
 * @route POST /api/users/acceptFriendRequest
 * @desc Route serving a POST request for a user to
 * accept a friend request.
 * @returns The user who's profile we are on's friendships after accepting their friend
 * request.
 */
router.post("/acceptFriendRequest", (req, res) => {

    Friendship.findOneAndUpdate({
        friendA: req.body.requesterID,
        friendB: req.body.requestedID
    }, {
        pending: false
        // eslint-disable-next-line no-unused-vars
    }, (friendship) => {

        // Find all the friends for the user who's profile we're on. //
        Friendship.find({ $or: [{ friendA: req.body.requesterID }, { friendB: req.body.requesterID }] })
            .populate({
                path: 'friendA'
            })
            .populate({
                path: 'friendB'
            })
            .then(friendships => {
                return res.json(friendships)
            })
    })
})

/**
 * @route POST /api/users/rejectFriendRequest
 * @desc Route serving a POST request for a user to reject a friend request.
 * After this, returns all of the friendships for the user who's profile we are on.
 * @returns The user who's profile we are on's friendships after rejecting their friend 
 * request to the user who calls this route.
 */
router.post("/rejectFriendRequest", (req, res) => {

    Friendship.findOneAndDelete({
        friendA: req.body.requesterID,
        friendB: req.body.requestedID
        // eslint-disable-next-line no-unused-vars
    }, (friendship) => {

        // Find all the friends for the user who's profile we're on. //
        Friendship.find({ $or: [{ friendA: req.body.requesterID }, { friendB: req.body.requesterID }] })
            .populate({
                path: 'friendA'
            })
            .populate({
                path: 'friendB'
            })
            .then(friendships => {
                return res.json(friendships)
            })
    })
})

/**
 * @route POST /api/users/removeFromFriends
 * @desc Route serving a POST request to delete a friendship between two users. After
 * deleting the friendship record, returns all of the friendships for the user who's profile
 * we are on.
 * @returns The user who's profile we are on's friendships after removing their friendship
 * with the user who calls this route.
 */
router.post("/removeFromFriends", (req, res) => {
    Friendship.findOneAndDelete({ $or: [{ friendA: req.body.friendA, friendB: req.body.friendB }, { friendA: req.body.friendB, friendB: req.body.friendA }] })
        .then(() => {
            Friendship.find({ $or: [{ friendA: req.body.friendA }, { friendB: req.body.friendA }] })
                .populate({
                    path: 'friendA'
                })
                .populate({
                    path: 'friendB'
                })
                .then(friendships => {
                    return res.json(friendships)
                })
        })
})

/**
 * @TODO convert this to a GET request, what was I thinking?
 * @route POST /api/users/getFriendRequests
 * @desc Route serving a POST request to get all pending friend requests
 * that have been sent to a user.
 * @returns An list of friend requests to the user who calls this route.
 */
router.post("/getFriendRequests", (req, res) => {
    Friendship.find({
        friendB: req.body.userID,
        pending: true
    })
        .populate({
            path: "friendA"
        })
        .then(requests => {
            if (!requests) {
                return res.json([])
            }
            return res.json(requests)
        })
})

/**
 * @route POST /api/users/createList
 * @desc Route serving a POST request to create a new List document.
 * @returns Boolean success.
 */
router.post("/createList", (req, res) => {

    const { errors, isValid } = listValidation(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    let list = new List({
        items: req.body.gameIDs,
        name: req.body.listName,
        description: req.body.listDescription
    })

    list.save().then(savedList => {
        User.findByIdAndUpdate(req.body.userID, { $push: { lists: savedList._id } })
            .then(() => {
                return res.status(200).json("Success")
            })
    })
})

/**
 * @route POST /api/users/editList
 * @desc Route serving a POST request to edit the values in a List document.
 * @returns Boolean success.
 */
router.post("/editList", (req, res) => {
    const { errors, isValid } = listValidation(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    List.findOne({ _id: req.body.listID })
        .then(list => {
            list.name = req.body.listName
            list.description = req.body.listDescription
            list.items = req.body.gameIDs

            list.save()
                .then(() => {
                    return res.status(200).json("Success")
                })
        })
})

/**
 * @route POST /api/users/deleteList/
 * @desc Route serving a POST request to remove a List document from the database.
 * @returns Boolean success.
 */
router.post("/deleteList", (req, res) => {
    List.findOneAndDelete({ _id: req.body.listID }).then(() => {
        return res.status(200).json("Success")
    })
})

//...............................................................................................................................................
//.HHHHHH.......HHHHHH...EEEEEEEEEEEEEEEEEE..LLLLLL............PPPPPPPPPPPPPPP.....PEEEEEEEEEEEEEEEEE..ERRRRRRRRRRRRRRRR........SSSSSSSSSSS......
//.HHHHHH.......HHHHHH...EEEEEEEEEEEEEEEEEE..LLLLLL............PPPPPPPPPPPPPPPPP...PEEEEEEEEEEEEEEEEE..ERRRRRRRRRRRRRRRRR......SSSSSSSSSSSSS.....
//.HHHHHH.......HHHHHH...EEEEEEEEEEEEEEEEEE..LLLLLL............PPPPPPPPPPPPPPPPP...PEEEEEEEEEEEEEEEEE..ERRRRRRRRRRRRRRRRRR....SSSSSSSSSSSSSSS....
//.HHHHHH.......HHHHHH...EEEEEEEEEEEEEEEEEE..LLLLLL............PPPPPPPPPPPPPPPPPP..PEEEEEEEEEEEEEEEEE..ERRRRRRRRRRRRRRRRRR...SSSSSSSSSSSSSSSSS...
//.HHHHHH.......HHHHHH...EEEEEE..............LLLLLL............PPPPPP....PPPPPPPP..PEEEEE..............ERRRRR.....RRRRRRRR...SSSSSSSS.SSSSSSSS...
//.HHHHHH.......HHHHHH...EEEEEE..............LLLLLL............PPPPPP......PPPPPP..PEEEEE..............ERRRRR.......RRRRRR...SSSSSS.....SSSSSS...
//.HHHHHH.......HHHHHH...EEEEEE..............LLLLLL............PPPPPP......PPPPPP..PEEEEE..............ERRRRR.......RRRRRR...SSSSSSS.............
//.HHHHHH.......HHHHHH...EEEEEE..............LLLLLL............PPPPPP......PPPPPP..PEEEEE..............ERRRRR.......RRRRRR...SSSSSSSSS...........
//.HHHHHH.......HHHHHH...EEEEEE..............LLLLLL............PPPPPP......PPPPPP..PEEEEE..............ERRRRR.....RRRRRRRR...SSSSSSSSSSSS........
//.HHHHHHHHHHHHHHHHHHH...EEEEEEEEEEEEEEEEE...LLLLLL............PPPPPP...PPPPPPPPP..PEEEEEEEEEEEEEEEE...ERRRRRRRRRRRRRRRRRR....SSSSSSSSSSSSS......
//.HHHHHHHHHHHHHHHHHHH...EEEEEEEEEEEEEEEEE...LLLLLL............PPPPPPPPPPPPPPPPPP..PEEEEEEEEEEEEEEEE...ERRRRRRRRRRRRRRRRR......SSSSSSSSSSSSSS....
//.HHHHHHHHHHHHHHHHHHH...EEEEEEEEEEEEEEEEE...LLLLLL............PPPPPPPPPPPPPPPPP...PEEEEEEEEEEEEEEEE...ERRRRRRRRRRRRRRRR........SSSSSSSSSSSSSS...
//.HHHHHHHHHHHHHHHHHHH...EEEEEEEEEEEEEEEEE...LLLLLL............PPPPPPPPPPPPPPPP....PEEEEEEEEEEEEEEEE...ERRRRRRRRRRRRRR............SSSSSSSSSSSSS..
//.HHHHHH.......HHHHHH...EEEEEE..............LLLLLL............PPPPPPPPPPPPPPP.....PEEEEE..............ERRRRR.RRRRRRRRR..............SSSSSSSSSS..
//.HHHHHH.......HHHHHH...EEEEEE..............LLLLLL............PPPPPP..............PEEEEE..............ERRRRR...RRRRRRRR................SSSSSSS..
//.HHHHHH.......HHHHHH...EEEEEE..............LLLLLL............PPPPPP..............PEEEEE..............ERRRRR....RRRRRRR....RSSSSS.......SSSSSS..
//.HHHHHH.......HHHHHH...EEEEEE..............LLLLLL............PPPPPP..............PEEEEE..............ERRRRR.....RRRRRRR...RSSSSSS......SSSSSS..
//.HHHHHH.......HHHHHH...EEEEEE..............LLLLLL............PPPPPP..............PEEEEE..............ERRRRR.....RRRRRRRR...SSSSSSSS..SSSSSSSS..
//.HHHHHH.......HHHHHH...EEEEEEEEEEEEEEEEEE..LLLLLLLLLLLLLLLLL.PPPPPP..............PEEEEEEEEEEEEEEEEE..ERRRRR......RRRRRRR...SSSSSSSSSSSSSSSSSS..
//.HHHHHH.......HHHHHH...EEEEEEEEEEEEEEEEEE..LLLLLLLLLLLLLLLLL.PPPPPP..............PEEEEEEEEEEEEEEEEE..ERRRRR.......RRRRRRR...SSSSSSSSSSSSSSSS...
//.HHHHHH.......HHHHHH...EEEEEEEEEEEEEEEEEE..LLLLLLLLLLLLLLLLL.PPPPPP..............PEEEEEEEEEEEEEEEEE..ERRRRR.......RRRRRRRR...SSSSSSSSSSSSSS....
//.HHHHHH.......HHHHHH...EEEEEEEEEEEEEEEEEE..LLLLLLLLLLLLLLLLL.PPPPPP..............PEEEEEEEEEEEEEEEEE..ERRRRR........RRRRRRR....SSSSSSSSSSS......
//...............................................................................................................................................


/**
 * Helper function that removes a user's presence from the database.
 * (Deletes all of their comments, reviews, friendships, and reports)
 * @param {Number} userID The _id of the user who's presence we want to remove. 
 */
async function removeUserPresence(userID) {
    await GameComment.deleteMany({ commenter: userID })
    await Review.deleteMany({ reviewer: userID })
    await ProfileComment.deleteMany({ commenter: userID })
    await Friendship.deleteMany({ $or: [{ friendA: userID }, { friendB: userID }] })
    await UserReport.deleteMany({ reported: userID })
    return true;
}

// Export the router. //
module.exports = router;
