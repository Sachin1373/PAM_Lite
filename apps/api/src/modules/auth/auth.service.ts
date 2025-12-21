import { findUserByEmail, createUser } from "./auth.repo";
import jwt, { Secret } from "jsonwebtoken";
import config from "../../config";
import * as repo from "../auth/auth.repo";
import pool from "../../db";
import bcrypt from "bcrypt";

interface jwtPayload {
    tenantId: string,
    userId: string,
    email: string,
    role: 'ADMIN' | 'APPROVER' | 'USER'
};

interface loginReq {
    email: string,
    password: string
}


export const register = async (input: {
    tenantName: string,
    owner: {
        name: string,
        email: string,
        password: string
    }
}): Promise<any> => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const tenant = await repo.createTenant(input.tenantName, client);
        const passwordHash = await bcrypt.hash(input.owner.password, 10);
        const user = await repo.createUser({
            tenantId: tenant.id,
            name: input.owner.name,
            email: input.owner.email,
            password: passwordHash,
            role: 'ADMIN'
        }, client)
        await client.query('COMMIT');

        return { tenant, user }
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }

}

export const login = async (input: loginReq) => {

    const user = await repo.findUserByEmail(input.email);
    if (!user) throw new Error('Invalid credentials')
    const ok = await bcrypt.compare(input.password, user.password_hash)
    if (!ok) throw new Error('Invalid credentials');

    const payload: jwtPayload = {
        tenantId: user.tenant_id,
        userId: user.id,
        email: user.email,
        role: user.role,
    }

    const token = jwt.sign(
        payload,
        config.auth.jwtSecret as Secret,
        { expiresIn: config.auth.jwtExpiresIn as | '15m' }
    );

    return { token }
}