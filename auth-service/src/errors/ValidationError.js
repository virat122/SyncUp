import ApiError from "./ApiError.js";

class ValidationError extends ApiError {

    constructor(message = "Validation Failed", errors = [], errorCode) {

        super(422, message, errorCode );

        this.errors = errors;

    }

}

export default ValidationError;