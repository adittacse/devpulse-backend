import { pool } from "../../db";
import { isValidIssueType } from "../../utility/validators";
import type { IIssue, IIssuePayload } from "./issue.interface";

const validateIssuePayload = (payload: IIssuePayload) => {
    const { title, description, type } = payload;

    if (!title || !description || !type) {
        throw new Error("Title, description and type are required");
    }

    if (title.length > 150) {
        throw new Error("Title must be maximum 150 characters");
    }

    if (description.length < 20) {
        throw new Error("Description must be minimum 20 characters");
    }

    if (!isValidIssueType(type)) {
        throw new Error("Type must be bug or feature_request");
    }
}

const createIssueIntoDB = async (payload: IIssuePayload, reporterId: number) => {
    validateIssuePayload(payload);
    const { title, description, type } = payload;

    const user = await pool.query(`
            SELECT id FROM users WHERE id = $1
        `, [reporterId]);

    if (user.rows.length === 0) {
        throw new Error("Reporter not found!");
    }

    const result = await pool.query(`
            INSERT INTO issues (title, description, type, reporter_id) VALUES ($1, $2, $3, $4) RETURNING *
        `, [title, description, type, reporterId]);

    return result.rows[0] as IIssue;
}

export const issueService = {
    createIssueIntoDB,
}