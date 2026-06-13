import type { IssueStatus, IssueType } from "../types";

export const isValidIssueType = (type: string): type is IssueType => {
    return type === "bug" || type === "feature_request";
}

export const isValidIssueStatus = (status: string): status is IssueStatus => {
    return status === "open" || status === "in_progress" || status === "resolved";
}