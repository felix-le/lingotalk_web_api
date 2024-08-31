import { Response } from 'express';

function responseServer(response: Response, statusCode: number, message: string, data?: any) {
  const responseData: any = {
    statusCode,
    message,
  };

  if (data) {
    responseData.count = data.length;
    responseData.data = data;
  }

  return response.status(statusCode).json(responseData);
}

function raiseException(response: Response, statusCode: number, message: string, error?: any) {
  const exceptionBody: any = {
    statusCode,
    message,
  };
  
  if (error) {
    exceptionBody.error = error;
  }
  
  return response.status(statusCode).json(exceptionBody);
}

export { responseServer, raiseException };
