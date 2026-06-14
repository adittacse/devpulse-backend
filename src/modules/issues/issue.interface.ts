import type { IssueStatus, IssueType, ROLES } from "../../types";

export interface IIssuePayload {
    title: string;
    description: string;
    type: IssueType;
}

export interface IIssueUpdatePayload {
    title?: string;
    description?: string;
    type?: IssueType;
    status?: IssueStatus;
}

export interface IIssue {
    id: number;
    title: string;
    description: string;
    type: IssueType;
    status: IssueStatus;
    reporter_id: number;
    created_at: Date;
    updated_at: Date;
}

export interface IReporter {
    id: number;
    name: string;
    role: ROLES;
}

export type IssueWithReporter = Omit<IIssue, "reporter_id"> & {
    reporter: IReporter | null;
}