const Validator = require('validator');
const IsImageUrl = require("is-image-url")
const isEmpty = require('is-empty');

module.exports = function validateGameSubmissionInput(data) {
    const errors = {};

    data.name = !isEmpty(data.name) ? data.name : '';
    data.coverart = !isEmpty(data.coverart) ? data.coverart : '';
    data.year = !isEmpty(data.year) ? data.year : '';
    data.platform = !isEmpty(data.platform) ? data.platform : '';
    data.description = !isEmpty(data.description) ? data.description : '';

    if (Validator.isEmpty(data.name)) {
        errors.name = 'Name field is required.';
    };

    if (Validator.isEmpty(data.coverart)) {
        errors.coverart = "Cover Art field is required."
    }
    else if (!IsImageUrl(data.coverart)) {
        errors.coverart = "Cover Art field must be an image URL."
    }

    if (Validator.isEmpty(data.year)) {
        errors.year = "Year field is required."
    }

    if (Validator.isEmpty(data.platform)) {
        errors.platform = "Platform field is required."
    }

    if (Validator.isEmpty(data.description) || !Validator.isLength(data.description, { min: 250 })) {
        errors.description = "Description must be at least 250 characters."
    }

    return {
        errors,
        isValid: isEmpty(errors),
    };

};
