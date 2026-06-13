import type { IssueType } from "../types";

export const isValidIssueType = (type: string): type is IssueType => {
    return type === "bug" || type === "feature_request";
}