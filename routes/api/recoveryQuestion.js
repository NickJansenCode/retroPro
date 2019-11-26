// NPM IMPORTS //
const express = require('express');

// MODEL IMPORTS //
const RecoveryQuestion = require('../../models/RecoveryQuestion');

/**
 * Express router to mount recovery question related actions on.
 * @type {express.Router}
 * @const
 * @namespace routes/api/recoveryQuestion
 */
const router = express.Router();

/**
 * @route GET /api/recoveryQuestions/
 * @desc Route serving a GET request to retrieve all recovery question documents.
 * @returns Recovery Question documents. @see RecoveryQuestion
 */
router.get('/', (req, res) => {
    RecoveryQuestion.find({}, (err, data) => {
        if (err) {
            return res.status(400).json(err);
        }
        return res.json(data);
    });
});


/**
 * @route POST /api/recoveryQuestions/
 * @desc Route serving a POST request to add a new recovery question document.
 * @returns Boolean success.
 */
router.post('/', (req, res) => {
    const recoveryQuestionDetails = {
        text: req.body.text,
    };

    const recoveryQuestionToInsert = new RecoveryQuestion(recoveryQuestionDetails);

    recoveryQuestionToInsert.save()
        .then(() => {
            res.status(200).json({ 'message': 'Recovery Question added succesfully!' });
        })
        // eslint-disable-next-line no-unused-vars
        .catch((err) => {
            res.status(400).send({ 'message': 'Failed to insert Recovery Question.' });
        });
});

// Export the router. //
module.exports = router;
