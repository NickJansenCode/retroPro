// NPM IMPORTS //
const Validator = require('validator');
const isEmpty = require('is-empty');

/**
 * Function to validate input on the promote user input.
 */
module.exports = function validatePromoteUserInput(data) {
    const errors = {};

    data.name = !isEmpty(data.name) ? data.name : '';

    if (Validator.isEmpty(data.name)) {
        errors.promoteName = 'User name field is required.';
    }

    return {
        errors,
        isValid: isEmpty(errors),
    };

};
