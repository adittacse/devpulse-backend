import type { Request, Response } from "express";
import sendResponse from "../../utility/sendResponse";
import { issueService } from "./issue.service";

const getAllIssues = async (req: Request, res: Response) => {
    try {
        const query: { sort?: string, type?: string, status?: string } = {};

        if (req.query.sort) {
            query.sort = req.query.sort as string;
        }

        if (req.query.type) {
            query.type = req.query.type as string;
        }

        if (req.query.status) {
            query.status = req.query.status as string;
        }

        const result = await issueService.getAllIssuesFromDB(query);

        return sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Issues retrieved successfully",
            data: result,
        });
    } catch (error: any) {
        return sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error.message,
            error: error,
        });
    }
}

const getSingleIssue = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const result = await issueService.getSingleIssueFromDB(id as string);

        return sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Issue retrieved successfully",
            data: result,
        });
    } catch (error: any) {
        return sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error.message,
            error: error,
        });
    }
}

const createIssue = async (req: Request, res: Response) => {
    try {
        const result = await issueService.createIssueIntoDB(req.body, req.user?.id);

        return sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "Issue created successfully",
            data: result,
        });
    } catch (error: any) {
        return sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error.message,
            error: error,
        });
    }
}

const updateIssue = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const result = await issueService.updateIssueIntoDB(req.body, id as string, req.user!);

        return sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Issue updated successfully",
            data: result,
        });
    } catch (error: any) {
        return sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error.message,
            error: error,
        });
    }
}

const deleteIssue = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await issueService.deleteIssueFromDB(id as string);

        return sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Issue deleted successfully",
        });
    } catch (error: any) {
        return sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error.message,
            error: error,
        });
    }
}

export const issueController = {
    getAllIssues,
    getSingleIssue,
    createIssue,
    updateIssue,
    deleteIssue,
}