"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.raiseException = exports.responseServer = void 0;
function responseServer(response, statusCode, message, data) {
    const responseData = {
        statusCode,
        message,
    };
    if (data) {
        responseData.count = data.length;
        responseData.data = data;
    }
    return response.status(statusCode).json(responseData);
}
exports.responseServer = responseServer;
function raiseException(response, statusCode, message, error) {
    const exceptionBody = {
        statusCode,
        message,
    };
    if (error) {
        exceptionBody.error = error;
    }
    return response.status(statusCode).json(exceptionBody);
}
exports.raiseException = raiseException;
//# sourceMappingURL=response.js.map