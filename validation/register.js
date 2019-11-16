const Validator = require('validator');
const isEmpty = require('is-empty');

module.exports = function validateRegisterInput(data) {
    const errors = {};

    data.name = !isEmpty(data.name) ? data.name : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.password2 = !isEmpty(data.password2) ? data.password2 : '';
    data.recoveryQuestion1ID = !isEmpty(data.recoveryQuestion1ID) ? data.recoveryQuestion1ID : '';
    data.recoveryQuestion2ID = !isEmpty(data.recoveryQuestion2ID) ? data.recoveryQuestion2ID : '';

    if (Validator.isEmpty(data.name)) {
        errors.name = 'Name field is required.';
    };

    if (Validator.isEmpty(data.email)) {
        errors.email = 'Email field is required.';
    } else if (!Validator.isEmail(data.email)) {
        errors.email = 'Email format is invalid.';
    }

    if (Validator.isEmpty(data.password)) {
        errors.password = 'Password field is required.';
    }

    if (Validator.isEmpty(data.password2)) {
        errors.password2 = 'Password confirmation field is required.';
    }

    if (Validator.isEmpty(data.recoveryQuestion1ID)) {
        errors.recoveryQuestion1ID = 'Password recovery question is required.';
    }

    if (Validator.isEmpty(data.recoveryQuestion2ID)) {
        errors.recoveryQuestion2ID = 'Password recovery question is required.';
    }

    if (!Validator.isEmpty(data.recoveryQuestion1ID) && !Validator.isEmpty(data.recoveryQuestion2ID)) {
        if (Validator.equals(data.recoveryQuestion1ID, data.recoveryQuestion2ID)) {
            errors.recoveryQuestion2ID = 'Recovery questions must not match.';
        }
    }

    if (Validator.isEmpty(data.recoveryQuestion1Answer)) {
        errors.recoveryQuestion1Answer = 'Answer is required.';
    }

    if (Validator.isEmpty(data.recoveryQuestion2Answer)) {
        errors.recoveryQuestion2Answer = 'Answer is required.';
    }

    if (!Validator.isLength(data.password, { min: 6 })) {
        errors.password = 'Password must be at least 6 characters.';
    }

    if (!Validator.equals(data.password, data.password2)) {
        errors.password2 = 'Passwords must match.';
    }

    return {
        errors,
        isValid: isEmpty(errors),
    };
};
