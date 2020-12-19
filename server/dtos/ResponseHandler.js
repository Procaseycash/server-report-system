class ResponseHandler {

    static success (res, data = {}, message,  statusCode = 200) {
        res.status(statusCode).json({message, data, status: statusCode});
    }

    static error (res, message, statusCode = 400) {
        res.status(statusCode).json({message, status: statusCode});
    }
}

module.exports = ResponseHandler;
