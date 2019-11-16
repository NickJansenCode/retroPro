const express = require('express');
const router = express.Router();
const Game = require('../../models/Game');
const Platform = require('../../models/Platform');

router.post('/', (req, res) => {
    const platformDetails = {
        name: req.body.name,
    };

    const platformToInsert = new Platform(platformDetails);

    platformToInsert.save()
        .then(() => {
            res.status(200).json({ 'message': 'Platform added succesfully!' });
        })
        .catch((err) => {
            res.status(400).send({ 'message': 'Failed to insert platform.' });
        });
});

module.exports = router;
