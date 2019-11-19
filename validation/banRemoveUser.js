const Validator = require('validator');
const isEmpty = require('is-empty');

module.exports = function validateBanRemoveUserInput(data) {
    const errors = {};

    data.name = !isEmpty(data.name) ? data.name : '';

    if (Validator.isEmpty(data.name)) {
        errors.banRemoveName = 'User name field is required.';
    };

    return {
        errors,
        isValid: isEmpty(errors),
    };

};
