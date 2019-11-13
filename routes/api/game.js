const Platform = require('../../models/Platform');
const Game = require('../../models/Game');
const User = require('../../models/User');
const express = require('express');
const router = express.Router();


router.get('/search/:name', (req, res) => {
  Game.find({'name': {$regex: '.*' + req.params.name + '.*', $options: 'i'}, 'inreviewqueue': false})
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
    inreviewqueue: true,
    coverart: req.body.coverart,
  };

  if (req.body.platform) {
    gameDetails.platform = req.body.platform;
  }

  const gameToInsert = new Game(gameDetails);

  gameToInsert.save()
      .then(() => {
        res.status(200).json({'message': 'Game added succesfully!'});
      })
      .catch((err) => {
        res.status(400).send({'message': 'Failed to insert Game.'});
      });
});

// router.get('/getByName/:name', (req, res) => {
//   Game.findOne({
//     'name': req.params.name,
//   })
//       .populate('platform')
//       .then((game) => {
//         if (game) {
//           res.json(game);
//         } else {
//           return res.status(400).json({message: 'Failed to find game.'});
//         }
//       });
// });

router.post('/loadGamePageData', (req, res) => {
  Game.findOne({'name': req.body.game})
      .populate('platform')
      .then((game) => {
        if (!game) {
          return res.status(400).json({message: 'Failed to find game.'});
        } else {
          User.findOne({'_id': req.body.user.id})
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
  Game.findOne({'name': req.body.game})
      .then((game) => {
        if (!game) {
          return res.status(400).json({message: 'Failed to find game.'});
        } else {
          if (req.body.played == true) {
            User.findByIdAndUpdate(req.body.user.id, {$pull: {gamesPlayed: game._id}}, () => {
              res.json(false);
            });
          } else {
            User.findByIdAndUpdate(req.body.user.id, {$push: {gamesPlayed: game._id}}, () => {
              res.json(true);
            });
          }
        }
      });
});

router.post('/toggleGameInCollection', (req, res) => {
  Game.findOne({'name': req.body.game})
      .then((game) => {
        if (!game) {
          return res.status(400).json({message: 'Failed to find game.'});
        } else {
          if (req.body.inCollection == true) {
            User.findByIdAndUpdate(req.body.user.id, {$pull: {gameCollection: game._id}}, () => {
              res.json(false);
            });
          } else {
            User.findByIdAndUpdate(req.body.user.id, {$push: {gameCollection: game._id}}, () => {
              res.json(true);
            });
          }
        }
      });
});

router.post('/toggleGameInWishlist', (req, res) => {
  Game.findOne({'name': req.body.game})
      .then((game) => {
        if (!game) {
          return res.status(400).json({message: 'Failed to find game.'});
        } else {
          if (req.body.inWishlist == true) {
            User.findByIdAndUpdate(req.body.user.id, {$pull: {wishlist: game._id}}, () => {
              res.json(false);
            });
          } else {
            User.findByIdAndUpdate(req.body.user.id, {$push: {wishlist: game._id}}, () => {
              res.json(true);
            });
          }
        }
      });
});


module.exports = router;
