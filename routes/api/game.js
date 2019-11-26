// NPM IMPORTS //
const express = require('express');

// VALIDATION IMPORTS //
const gameSubmissionValidation = require('../../validation/gameSubmission');

// MODEL IMPORTS //
// eslint-disable-next-line no-unused-vars
const Platform = require('../../models/Platform');
const Game = require('../../models/Game');
const User = require('../../models/User');
const Review = require('../../models/Review');
const Comment = require('../../models/GameComment');
const List = require("../../models/List")

/**
 * Express router to mount game related actions on.
 * @type {express.Router}
 * @const
 * @namespace routes/api/game
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
 * @route GET /api/games/search/:name
 * @desc Route serving game search functionality. Searches for
 * and returns game records based on their name.
 * @returns Game records. @see Game
 */
router.get('/search/:name', (req, res) => {
    Game.find({ 'name': { $regex: '.*' + req.params.name + '.*', $options: 'i' }, 'inreviewqueue': false })
        .populate({
            path: 'reviews',
            select: 'rating'
        })
        .then(((games) => {
            res.status(200).json(games);
        }))
        .catch((err) => {
            res.status(500).json(err);
        });
});

/**
 * @route GET /api/games/getSubmissions
 * @desc Route serving a GET request for loading
 * all currently pending game submissions.
 * @returns Game Records @see Game
 */
router.get("/getSubmissions", (req, res) => {
    Game.find({ inreviewqueue: true })
        .then(games => {
            return res.status(200).json(games)
        })
})

/**
 * @route GET /api/games/getSubmission/:id
 * @desc Route serving a GET request to get the details for a 
 * game submission.
 * @returns A Game Record. @see Game
 */
router.get("/getSubmission/:id", (req, res) => {
    Game.findOne({ _id: req.params.id })
        .populate({
            path: "platform",
            select: "name"
        })
        .then(game => {
            if (game) {
                return res.status(200).json({
                    inreviewqueue: game.inreviewqueue,
                    coverart: game.coverart,
                    name: game.name,
                    platform: game.platform.name,
                    year: game.year,
                    description: game.description
                })
            }
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
 * @route POST /api/games/
 * @desc Route serving a POST request to create a new game record.
 * @returns Boolean success
 * @deprecated
 */
router.post('/', (req, res) => {
    const gameDetails = {
        year: req.body.year,
        name: req.body.name,
        description: req.body.description,
        platform: req.body.platform,
        coverart: req.body.coverart,
    };

    const gameToInsert = new Game(gameDetails);

    gameToInsert.save()
        .then(() => {
            res.status(200).json({ 'message': 'Game added succesfully!' });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).send({ 'message': 'Failed to insert Game.' });
        });
});

/**
 * @route POST /api/games/submit
 * @desc Route serving a POST request to create a new game submission.
 * @returns Boolean success.
 */
router.post('/submit', (req, res) => {
    const { errors, isValid } = gameSubmissionValidation(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    Game.findOne({
        name: req.body.name
    })
        .then(game => {
            if (game) {
                return res.status(400).json({ name: 'A game with this name already exists.' })
            }

            const newGame = new Game({
                year: req.body.year,
                name: req.body.name,
                description: req.body.description,
                platform: req.body.platform,
                coverart: req.body.coverart,
            });

            newGame.save()
                .then(() => {
                    res.status(200).json("Success!")
                })

        })
})

/**
 * @route POST /api/games/approveSubmission
 * @desc Route serving a POST request to approve a game submission.
 * @returns The name of the game who's submission is being approved.
 */
router.post("/approveSubmission", (req, res) => {
    Game.findById(req.body.gameID)
        .then(game => {
            game.inreviewqueue = false
            game.save().then(() => {
                return res.status(200).json({ gameName: game.name })
            })
        })
})

/**
 * @route POST /api/games/rejectSubmission
 * @desc Route serving a POST request to reject a game submission.
 * @returns Boolean success.
 */
router.post("/rejectSubmission", (req, res) => {
    Game.findByIdAndDelete(req.body.gameID)
        .then(() => {
            return res.status(200).json("Success")
        })
})

/**
 * @route POST /api/games/
 * @desc Route serving a
 * @returns
 */
router.post('/loadGamePageData', (req, res) => {
    Game.findOne({ 'name': req.body.game })
        .populate('platform')
        .populate({
            path: 'comments',
            populate: {
                path: 'commenter',
            },
        })
        .populate({
            path: 'reviews',
            populate: {
                path: 'reviewer',
            }
        })
        .then((game) => {
            if (!game) {
                return res.status(400).json({ message: 'Failed to find game.' });
            } else {
                User.findOne({ '_id': req.body.user.id })
                    .then((user) => {
                        const gamePlayed = user.gamesPlayed.includes(game._id);
                        const gameInCollection = user.gameCollection.includes(game._id);
                        const gameInWishlist = user.wishlist.includes(game._id);

                        res.status(200).json({
                            game: game,
                            gamePlayed: gamePlayed,
                            gameInCollection: gameInCollection,
                            gameInWishlist: gameInWishlist,
                        });
                    });
            }
        });
});

/**
 * @route POST /api/games/toggleGamePlayed
 * @desc Route serving a POST request to toggle a game's played status for the
 * requesting user.
 * @returns Boolean representing whether or not the game has been played, after the
 * toggle.
 */
router.post('/toggleGamePlayed', (req, res) => {
    Game.findOne({ 'name': req.body.game })
        .then((game) => {
            if (!game) {
                return res.status(400).json({ message: 'Failed to find game.' });
            } else {
                if (req.body.played == true) {
                    User.findByIdAndUpdate(req.body.user.id, { $pull: { gamesPlayed: game._id } }, () => {
                        res.json(false);
                    });
                } else {
                    User.findByIdAndUpdate(req.body.user.id, { $push: { gamesPlayed: game._id } }, () => {
                        res.json(true);
                    });
                }
            }
        });
});

/**
 * @route POST /api/games/toggleGameInCollection
 * @desc Route serving a POST request to toggle a game's presence in the
 * requesting user's collection.
 * @returns Boolean representing whether or not the game is in the user's collection
 * after the toggle.
 */
router.post('/toggleGameInCollection', (req, res) => {
    Game.findOne({ 'name': req.body.game })
        .then((game) => {
            if (!game) {
                return res.status(400).json({ message: 'Failed to find game.' });
            } else {
                if (req.body.inCollection == true) {
                    User.findByIdAndUpdate(req.body.user.id, { $pull: { gameCollection: game._id, highlights: game._id } }, (err, user) => {

                        // Remove the game from all of the user's lists. If the list ends up being empty, delete the list. //
                        List.find({ _id: user.lists })
                            .then((lists) => {
                                lists.forEach(list => {
                                    list.items = list.items.filter(item => {
                                        return item.toString() != game._id.toString()
                                    })
                                    list.save().then(savedList => {
                                        if (savedList.items.length < 1) {
                                            savedList.remove()
                                        }
                                    })
                                })
                            })
                            .then(() => {
                                res.json(false);
                            })
                    });
                } else {
                    User.findByIdAndUpdate(req.body.user.id, { $push: { gameCollection: game._id } }, () => {
                        res.json(true);
                    });
                }
            }
        });
});

/**
 * @route POST /api/games/toggleGameInWishlist
 * @desc Route serving a POST request to toggle a game's presence
 * in the requesting user's wishlist.
 * @returns Boolean representing whether or not the game is in the user's wishlist
 * after the toggle.
 */
router.post('/toggleGameInWishlist', (req, res) => {
    Game.findOne({ 'name': req.body.game })
        .then((game) => {
            if (!game) {
                return res.status(400).json({ message: 'Failed to find game.' });
            } else {
                if (req.body.inWishlist == true) {
                    User.findByIdAndUpdate(req.body.user.id, { $pull: { wishlist: game._id } }, () => {
                        res.json(false);
                    });
                } else {
                    User.findByIdAndUpdate(req.body.user.id, { $push: { wishlist: game._id } }, () => {
                        res.json(true);
                    });
                }
            }
        });
});

/**
 * @route POST /api/games/addComment
 * @desc Route serving a POST request for adding a comment to a game's page.
 * @returns The game's comments after the new comment has been added.
 */
router.post('/addComment', (req, res) => {
    const commentDetails = {
        commenter: req.body.userId,
        text: req.body.comment,
        timestamp: req.body.timestamp,
    };

    const commentToInsert = new Comment(commentDetails);

    commentToInsert.save().then((comment) => {
        Game.findByIdAndUpdate(req.body.gameId, { $push: { comments: comment._id } })
            .then(() => {
                Game.findOne({ _id: req.body.gameId })
                    .populate({
                        path: 'comments',
                        populate: {
                            path: 'commenter',
                        },
                    })
                    .then((data) => {
                        res.status(200).json(data.comments);
                    });
            });
    });
});

/**
 * @route POST /api/games/
 * @desc Route serving a POST request to add a review to a game's page.
 * @returns The game's reviews after the new review has been added.
 */
router.post('/addReview', (req, res) => {
    const reviewDetails = {
        reviewer: req.body.userId,
        rating: req.body.rating,
        title: req.body.reviewTitle,
        text: req.body.reviewText,
        timestamp: req.body.timestamp,
    };

    const reviewToInsert = new Review(reviewDetails);

    reviewToInsert.save().then((review) => {
        Game.findByIdAndUpdate(req.body.gameId, { $push: { reviews: review._id } })
            .then(() => {
                Game.findOne({ _id: req.body.gameId })
                    .populate({
                        path: 'reviews',
                        populate: {
                            path: 'reviewer',
                        },
                    })
                    .then((data) => {
                        res.status(200).json(data.reviews);
                    });
            });
    });
});

// Export the router. //
module.exports = router;
