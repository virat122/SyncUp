import ApiError from "./ApiError.js";

class ConflictError extends ApiError {

    constructor(message = "Conflict" ,errorCode) {
        
        super(409, message ,errorCode);
    }

}

export default ConflictError;