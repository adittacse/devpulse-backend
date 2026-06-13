import { pool } from "../../db";
import bcrypt from "bcryptjs";
import { USER_ROLE } from "../../types";
import type { ICreateUser } from "./auth.interface";

const createUserIntoDB = async (payload: ICreateUser) => {
    const { name, email, password } = payload;
    const role = payload.role || USER_ROLE.contributor;

    if (!name) {
        throw new Error("Name is Required");
    }

    if (!email) {
        throw new Error("Email is Required");
    }

    if (!password) {
        throw new Error("Password is Required");
    }

    const existingUser = await pool.query(`
            SELECT email FROM users WHERE email = $1
        `, [email]);
    
    if (existingUser.rows.length !== 0) {
        throw new Error("User already exists!");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(`
            INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *
        `, [name, email, hashPassword, role]);
    
    delete result.rows[0].password;

    return result;
}

export const authService = {
    createUserIntoDB,
}