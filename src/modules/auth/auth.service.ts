import { pool } from "../../db";
import bcrypt from "bcryptjs";
import { USER_ROLE } from "../../types";
import type { ICreateUser } from "./auth.interface";
import jwt from "jsonwebtoken";
import config from "../../config";

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

const loginUserIntoDB = async (payload: { email: string, password: string }) => {
    const { email, password } = payload;

    // 1. check if the user exists
    const userData = await pool.query(`
            SELECT * FROM users WHERE email = $1
        `, [email]);

    if (userData.rows.length === 0) {
        throw new Error("Invalid Credentials!");
    }

    // 2. compare the password
    const user = userData.rows[0];

    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword) {
        throw new Error("Invalid Credentials!");
    }

    // 3. generate a token
    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    }

    const accessToken = jwt.sign(jwtPayload, config.jwt_secret, {
        expiresIn: "1d"
    });

    delete user.password;

    return {
        accessToken,
        user
    }
}

export const authService = {
    createUserIntoDB,
    loginUserIntoDB,
}