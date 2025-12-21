import pool from "../../db";
import { UserPublic, CreateUserInput } from "../auth/auth.types";

export const checkUserAlreadyExists = async (email: string, tenantId: string) => {
  const res = await pool.query(
    `SELECT * FROM users WHERE email = $1 AND tenant_id = $2`,
    [email, tenantId]
  )

  return res.rows[0] ?? null;
}

export const createUser = async (input: CreateUserInput): Promise<UserPublic> => {
  const res = await pool.query<UserPublic>(
    `
    INSERT INTO users (
      tenant_id,
      name,
      email,
      password_hash,
      role,
      created_by
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING
      id,
      tenant_id     AS "tenantId",
      name,
      email,
      role,
      created_at    AS "createdAt"
    `,
    [
      input.tenantId,
      input.name,
      input.email,
      input.password,
      input.role,
      input.createdBy ?? null
    ]
  );

  return res.rows[0] ?? null;
}

export const getUsers = async (tenant: string) => {
  const res = await pool.query(
    'SELECT * FROM users where tenant_id = $1',
    [tenant]
  )

  return res.rows ?? null;
}

export const checkTenant = async (tenant: string) => {
  const res = await pool.query(
    'SELECT id FROM tenants where id = $1',
    [tenant]
  )

  return res.rows[0] ?? null;
}

export const updateUser = async (
  userId: string,
  tenantId: string,
  updates: { name?: string; role?: string }
) => {
  const res = await pool.query(
    `
    UPDATE users
    SET name = COALESCE($1, name),
        role = COALESCE($2, role)
    WHERE id = $3 AND tenant_id = $4
    RETURNING
      id,
      tenant_id     AS "tenantId",
      name,
      email,
      role,
      created_at    AS "createdAt"
    `,
    [updates.name, updates.role, userId, tenantId]
  );

  return res.rows[0] ?? null;
};

export const deleteUser = async (userId: string, tenantId: string) => {
  const res = await pool.query(
    `DELETE FROM users WHERE id = $1 AND tenant_id = $2`,
    [userId, tenantId]
  );
  return res.rowCount ? res.rowCount > 0 : false;
};