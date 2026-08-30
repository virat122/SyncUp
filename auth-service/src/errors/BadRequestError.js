import ApiError from "./ApiError.js";

class BadRequestError extends ApiError {

    constructor(message = "Bad Request" ,errorCode) {
        super(400, message ,errorCode);
    }

}

export default BadRequestError;