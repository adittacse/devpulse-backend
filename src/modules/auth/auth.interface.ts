import type { ROLES } from "../../types";

export interface ICreateUser {
    name: string;
    email: string;
    password: string;
    role?: ROLES;
}