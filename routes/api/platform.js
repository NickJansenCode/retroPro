// NPM IMPORTS //
const express = require('express');

// MODEL IMPORTS //
// eslint-disable-next-line no-unused-vars
const Game = require('../../models/Game');
const Platform = require('../../models/Platform');

/**
 * Express router to mount platform related actions on.
 * @type {express.Router}
 * @const
 * @namespace routes/api/platforms
 */
const router = express.Router();

/**
 * @route GET /api/platforms/
 * @desc Route serving a GET request to retrieve all platform documents.
 * @returns Platform documents. @see Platform
 */
router.get("/", (req, res) => {
    Platform.find({})
        .then(platforms => {
            return res.status(200).json(platforms)
        })
})

/**
 * @route POST /api/platforms/
 * @desc Route serving a POST request to add a new platform document.
 * @returns Boolean success.
 */
router.post('/', (req, res) => {
    const platformDetails = {
        name: req.body.name,
    };

    const platformToInsert = new Platform(platformDetails);

    platformToInsert.save()
        .then(() => {
            res.status(200).json({ 'message': 'Platform added succesfully!' });
        })
        // eslint-disable-next-line no-unused-vars
        .catch((err) => {
            res.status(400).send({ 'message': 'Failed to insert platform.' });
        });
});

// Export the router. //
module.exports = router;
