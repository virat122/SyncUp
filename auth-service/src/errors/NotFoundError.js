import ApiError from "./ApiError.js";

class NotFoundError extends ApiError {

    constructor(message = "Resource Not Found", errorCode) {
        super(404, message, errorCode);
    }

}

export default NotFoundError;