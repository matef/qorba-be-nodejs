
var ValidatorClass = require('validator').Validator;

ValidatorClass.prototype.error = function (msg) {
    this._errors.push(msg);
    return this;
};

ValidatorClass.prototype.getErrors = function () {
    return this._errors;
};

var validator = new ValidatorClass();

exports = {
		check : validator.check,
		sanitize : validator.sanitize
};
