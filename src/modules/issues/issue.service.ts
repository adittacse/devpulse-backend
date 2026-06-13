import { pool } from "../../db";
import { isValidIssueStatus, isValidIssueType } from "../../utility/validators";
import type { IIssue, IIssuePayload, IssueWithReporter } from "./issue.interface";

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

const addReporterInfo = async (issues: IIssue[]) => {
    const issuesWithReporter: IssueWithReporter[] = [];

    for (const issue of issues) {
        const reporterData = await pool.query(
            `SELECT id, name, role FROM users WHERE id = $1`,
            [issue.reporter_id]
        );

        const reporter = reporterData.rows[0] || null;

        issuesWithReporter.push({
            id: issue.id,
            title: issue.title,
            description: issue.description,
            type: issue.type,
            status: issue.status,
            reporter: reporter,
            created_at: issue.created_at,
            updated_at: issue.updated_at,
        });
    }

    return issuesWithReporter;
}

const getAllIssuesFromDB = async (query: { sort?: string; type?: string; status?: string }) => {
    const sort = query.sort || "newest";
    const type = query.type;
    const status = query.status;

    if (sort !== "newest" && sort !== "oldest") {
        throw new Error("Sort must be newest or oldest");
    }

    if (type && !isValidIssueType(type)) {
        throw new Error("Type must be bug or feature_request");
    }

    if (status && !isValidIssueStatus(status)) {
        throw new Error("Status must be open, in_progress or resolved");
    }

    let order = "DESC";

    if (sort === "oldest") {
        order = "ASC";
    }

    let result;

    if (type && status) {
        result = await pool.query(
            `SELECT * FROM issues WHERE type = $1 AND status = $2 ORDER BY created_at ${order}`,
            [type, status]
        );
    } else if (type) {
        result = await pool.query(
            `SELECT * FROM issues WHERE type = $1 ORDER BY created_at ${order}`,
            [type]
        );
    } else if (status) {
        result = await pool.query(
            `SELECT * FROM issues WHERE status = $1 ORDER BY created_at ${order}`,
            [status]
        );
    } else {
        result = await pool.query(
            `SELECT * FROM issues ORDER BY created_at ${order}`
        );
    }

    const issues = result.rows as IIssue[];

    return await addReporterInfo(issues);
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
    getAllIssuesFromDB,
    createIssueIntoDB,
}