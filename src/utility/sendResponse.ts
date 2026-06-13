import type { Response } from "express";

type TResponse<T> = {
    success: boolean;
    statusCode: number;
    message: string;
    data?: T;
    error?: unknown;
}

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
    return res.status(data.statusCode).json({
        success: data.success,
        message: data.message,
        data: data.data,
        error: data.error,
    });
}

export default sendResponse;