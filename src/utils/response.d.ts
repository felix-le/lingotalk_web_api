import { Response } from 'express';
declare function responseServer(response: Response, statusCode: number, message: string, data?: any): Response<any, Record<string, any>>;
declare function raiseException(response: Response, statusCode: number, message: string, error?: any): Response<any, Record<string, any>>;
export { responseServer, raiseException };
