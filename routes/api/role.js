const express = require('express');
const router = express.Router();
const Role = require('../../models/Role');

router.post('/', (req, res) => {
    const roleDetails = {
        name: req.body.name,
    };

    const roleToInsert = new Role(roleDetails);

    roleToInsert.save()
        .then(() => {
            res.status(200).json({ 'message': 'Role added succesfully!' });
        })
        .catch((err) => {
            res.status(400).send({ 'message': 'Failed to insert role.' });
        });
});

module.exports = router;
