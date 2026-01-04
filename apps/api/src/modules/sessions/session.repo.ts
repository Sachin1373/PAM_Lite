import pool from "../../db";
import { Session } from "./session.types";

export const getAccessRequestForSession = async (id: string, userId: string) => {
    const res = await pool.query(
        `SELECT * FROM access_requests WHERE id = $1 AND user_id = $2`,
        [id, userId]
    );
    return res.rows[0];
};

export const getApplicationForSession = async (id: string) => {
    const res = await pool.query(
        `SELECT target_url, auth_config FROM applications WHERE id = $1`,
        [id]
    );
    return res.rows[0];
};

export const createSession = async (data: {
    tenant_id: string;
    user_id: string;
    application_id: string;
    access_request_id: string;
    token: string;
    expires_at: Date;
    target_url: string;
    auth_config: any;
}) => {
    try {
        const res = await pool.query(
            `INSERT INTO sessions (
            tenant_id,
            user_id,
            application_id,
            access_request_id,
            token,
            expires_at,
            target_url,
            auth_config,
            status,
            is_active
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'ACTIVE', true)
        RETURNING *`,
            [
                data.tenant_id,
                data.user_id,
                data.application_id,
                data.access_request_id,
                data.token,
                data.expires_at,
                data.target_url,
                data.auth_config,
            ]
        );
        return res.rows[0];
    } catch (err) {
        console.error("createSession repo: insert failed", err);
        throw err;
    }
};

export const getSessionDetails = async (token: string) => {
    const res = await pool.query(
        `SELECT * FROM sessions WHERE token = $1`,
        [token]
    )
    if (res.rowCount === 0) return null;
    const session = res.rows[0]
    session.expires_at = new Date(session.expires_at);
    session.created_at = new Date(session.created_at);
    return session;
}

export const sessionRevoke = async (sessionId: string) => {
    const res = await pool.query(
        `
        UPDATE sessions
        SET is_active = false
        WHERE id = $1
        RETURNING id
        `,
        [sessionId]
    )

    return res.rowCount == 1;
}
