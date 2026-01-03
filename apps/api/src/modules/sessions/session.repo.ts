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
        ]
    );
    return res.rows[0];
};
