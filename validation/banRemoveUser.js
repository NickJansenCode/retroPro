// NPM IMPORTS //
const Validator = require('validator');
const isEmpty = require('is-empty');

/**
 * Function to validate input on the ban/remove user input.
 */
module.exports = function validateBanRemoveUserInput(data) {
    const errors = {};

    data.name = !isEmpty(data.name) ? data.name : '';

    if (Validator.isEmpty(data.name)) {
        errors.banRemoveName = 'User name field is required.';
    }

    return {
        errors,
        isValid: isEmpty(errors),
    };

};
