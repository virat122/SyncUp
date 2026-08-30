import ApiError from "./ApiError.js";

class ConfigurationError extends ApiError {

    constructor(message, errorCode = "CONFIG-001") {
        super(500, message, errorCode);
        this.name = "ConfigurationError";
    }

}

export default ConfigurationError;