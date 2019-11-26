// NPM IMPORTS //
const express = require('express');

// MODEL IMPORTS //
const Role = require('../../models/Role');

/**
 * Express router to mount role related actions on.
 * @type {express.Router}
 * @const
 * @namespace routes/api/roles
 */
const router = express.Router();

/**
 * @route POST /api/roles/
 * @desc Route serving a POST request to add a new Role document.
 * @returns Boolean success.
 */
router.post('/', (req, res) => {
    const roleDetails = {
        name: req.body.name,
    };

    const roleToInsert = new Role(roleDetails);

    roleToInsert.save()
        .then(() => {
            res.status(200).json({ 'message': 'Role added succesfully!' });
        })
        // eslint-disable-next-line no-unused-vars
        .catch((err) => {
            res.status(400).send({ 'message': 'Failed to insert role.' });
        });
});

// Export the router. //
module.exports = router;
