const Platform = require('../../models/Platform');
const Game = require('../../models/Game');
const express = require('express');
const router = express.Router();


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

router.get('/getByName/:name', (req, res) => {
  Game.findOne({
    'name': req.params.name,
  })
      .populate('platform')
      .then((game) => {
        if (game) {
          res.json(game);
        } else {
          return res.status(400).json({message: 'Failed to find game.'});
        }
      });
});


module.exports = router;
