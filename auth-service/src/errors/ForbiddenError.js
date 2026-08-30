import ApiError from "./ApiError.js";

class ForbiddenError extends ApiError {

    constructor(message = "Forbidden", errorCode) {
        super(403, message, errorCode);
    }

}

export default ForbiddenError;