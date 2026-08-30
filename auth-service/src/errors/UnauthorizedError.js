import ApiError from "./ApiError.js";

class UnauthorizedError extends ApiError {

    constructor(message = "Unauthorized", errorCode ) {
        super(401, message, errorCode);
    }

}

export default UnauthorizedError;