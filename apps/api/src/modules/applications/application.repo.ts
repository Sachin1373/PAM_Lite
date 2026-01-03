import pool from "../../db";


export const addApplication = async (data: any) => {
    const res = await pool.query(
        `INSERT INTO applications (
            tenant_id,
            name,
            type,
            target_url,
            auth_config,
            description,
            created_by
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING
        id,
        tenant_id,
        name,
        type,
        target_url,
        auth_config,
        description,
        created_by
        `,
        [
            data.tenant_id,
            data.name,
            data.type,
            data.target_url,
            data.auth_config,
            data.description,
            data.created_by
        ]

    )

    return res.rows[0] ?? null;
}

export const checkApplication = async (tenantId: string, userId: string, applicationName: string) => {
    const res = await pool.query(
        'SELECT * FROM applications where tenant_id = $1 AND created_by = $2 AND  name = $3',
        [tenantId, userId, applicationName]
    )

    return res.rows[0] ?? null;
}

export const updateApplication = async (
    applicationId: string,
    tenantId: string,
    updates: any
) => {
    const res = await pool.query(
        `
    UPDATE applications
    SET name = COALESCE($1, name),
        type = COALESCE($2, type),
        target_url = COALESCE($3, target_url),
        description = COALESCE($4, description)
    WHERE id = $5 AND tenant_id = $6
    RETURNING
      id,
      tenant_id,
      name,
      type,
      target_url,
      description,
      created_by,
      created_at
    `,
        [
            updates.name,
            updates.app_type,
            updates.target_url,
            updates.description,
            applicationId,
            tenantId,
        ]
    );
    return res.rows[0] ?? null;
};

export const getApplications = async (tenantId: string) => {
    const res = await pool.query(
        `SELECT * FROM applications WHERE tenant_id = $1`,
        [tenantId]
    );
    return res.rows ?? [];
};

export const deleteApplication = async (applicationId: string, tenantId: string) => {
    const res = await pool.query(
        `DELETE FROM applications WHERE id = $1 AND tenant_id = $2`,
        [applicationId, tenantId]
    );
    return res.rowCount ? res.rowCount > 0 : false;
};