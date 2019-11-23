const Validator = require('validator');
const isEmpty = require('is-empty');

module.exports = function validateCreateListInput(data) {
    const errors = {};

    data.listName = !isEmpty(data.listName) ? data.listName : '';
    data.listDescription = !isEmpty(data.listDescription) ? data.listDescription : '';
    data.gameIDs = !isEmpty(data.gameIDs) ? data.gameIDs : [];

    if (Validator.isEmpty(data.listName)) {
        errors.name = 'List name field is required.';
    };

    if (Validator.isEmpty(data.listDescription)) {
        errors.description = 'List description field is required.';
    };

    if (data.gameIDs.length == 0) {
        errors.games = "You must select at least one game!";
    }


    return {
        errors,
        isValid: isEmpty(errors),
    };

};
