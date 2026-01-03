import { application } from "express";
import pool from "../../db";
import { CreateAccessRequestPayload } from "./access_req.types";

export const createAccessRequest = async (client: any, data: any) => {
  const res = await client.query(
    `INSERT into access_requests (
            tenant_id,
            user_id,
            application_id,
            reason,
            duration_minutes
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING
         id,
         tenant_id,
         user_id,
         application_id,
         reason,
         duration_minutes,
         status,
         requested_at
        `,
    [
      data.tenant_id,
      data.user_id,
      data.application_id,
      data.reason ?? null,
      data.duration_minutes
    ]
  )

  return res
}

export const addApprovers = async (
  client: any,
  accessRequestId: string,
  approvers: string[]
) => {
  const values = approvers
    .map((_, i) => `($1, $${i + 2})`)
    .join(',');

  const params = [accessRequestId, ...approvers];

  await client.query(
    `
    INSERT INTO access_request_approvers
    (access_request_id, approver_id)
    VALUES ${values}
    `,
    params
  );
};

export const checkAlreadyRequestRaised = async (
  tenantId: string,
  userId: string,
  applicationId: string
): Promise<boolean> => {
  const res = await pool.query<{ exists: boolean }>(
    `
    SELECT EXISTS (
      SELECT 1
      FROM access_requests
      WHERE tenant_id = $1
        AND user_id = $2
        AND application_id = $3
        AND status = 'PENDING'
    ) AS exists
    `,
    [tenantId, userId, applicationId]
  );

  return res.rows[0].exists;
};

export const getAccessRequests = async (
  tenant_id: string,
  approver_id: string
): Promise<any> => {
  const res = await pool.query(
    `SELECT 
            ar.*,
            u.name as requester_name,
            u.email as requester_email,
            app.name as application_name
        FROM access_requests ar
        INNER JOIN access_request_approvers ara ON ar.id = ara.access_request_id
        LEFT JOIN users u ON ar.user_id = u.id
        LEFT JOIN applications app ON ar.application_id = app.id
        WHERE ar.tenant_id = $1 AND ara.approver_id = $2
        ORDER BY ar.requested_at DESC`,
    [tenant_id, approver_id]
  )

  return res.rows;
}

export const approveAccessRequest = async (
  access_request_id: string,
  approver_id: string,
  tenant_id: string
): Promise<any> => {
  const res = await pool.query(
    `UPDATE access_request_approvers
        SET status = 'APPROVED', acted_at = NOW()
        WHERE access_request_id = $1 
        AND approver_id = $2
        AND access_request_id IN (
            SELECT id FROM access_requests WHERE tenant_id = $3
        )
        RETURNING *`,
    [access_request_id, approver_id, tenant_id]
  );

  return res.rows[0];
}

export const updateAccessRequestStatus = async (
  access_request_id: string,
  status: string
): Promise<any> => {
  const res = await pool.query(
    `UPDATE access_requests
        SET status = $1
        WHERE id = $2
        RETURNING *`,
    [status, access_request_id]
  );

  return res.rows[0];
}

export const getUserAccessRequests = async (
  tenant_id: string,
  user_id: string
): Promise<any> => {
  const res = await pool.query(
    `SELECT 
            ar.id,
            ar.status,
            ar.reason,
            ar.duration_minutes,
            ar.requested_at,
            app.id as application_id,
            app.name as application_name,
            app.description as application_description,
            app.target_url as application_target_url
        FROM access_requests ar
        LEFT JOIN applications app ON ar.application_id = app.id
        WHERE ar.tenant_id = $1 AND ar.user_id = $2
        ORDER BY ar.requested_at DESC`,
    [tenant_id, user_id]
  );

  return res.rows;
}