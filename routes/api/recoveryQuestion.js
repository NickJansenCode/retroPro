const express = require('express');
const router = express.Router();
const RecoveryQuestion = require('../../models/RecoveryQuestion');

router.get('/', (req, res) => {
    RecoveryQuestion.find({}, (err, data) => {
        if (err) {
            return res.status(400).json(err);
        }
        return res.json(data);
    });
});


router.post('/', (req, res) => {
    const recoveryQuestionDetails = {
        text: req.body.text,
    };

    const recoveryQuestionToInsert = new RecoveryQuestion(recoveryQuestionDetails);

    recoveryQuestionToInsert.save()
        .then(() => {
            res.status(200).json({ 'message': 'Recovery Question added succesfully!' });
        })
        .catch((err) => {
            res.status(400).send({ 'message': 'Failed to insert Recovery Question.' });
        });
});

module.exports = router;
