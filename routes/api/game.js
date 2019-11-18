const Platform = require('../../models/Platform');
const Game = require('../../models/Game');
const User = require('../../models/User');
const Review = require('../../models/Review');
const Comment = require('../../models/GameComment');
const gameSubmissionValidation = require('../../validation/gameSubmission');
const express = require('express');
const router = express.Router();


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

router.post('/toggleGameInCollection', (req, res) => {
    Game.findOne({ 'name': req.body.game })
        .then((game) => {
            if (!game) {
                return res.status(400).json({ message: 'Failed to find game.' });
            } else {
                if (req.body.inCollection == true) {
                    User.findByIdAndUpdate(req.body.user.id, { $pull: { gameCollection: game._id, highlights: game._id } }, () => {
                        res.json(false);
                    });
                } else {
                    User.findByIdAndUpdate(req.body.user.id, { $push: { gameCollection: game._id } }, () => {
                        res.json(true);
                    });
                }
            }
        });
});

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


module.exports = router;
