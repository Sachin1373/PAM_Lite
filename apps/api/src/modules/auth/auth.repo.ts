import pool from "../../db";
import { CreateUserInput, UserPublic, Tenant } from "./auth.types";
import { PoolClient } from "pg";


export const findUserByEmail = async (email: string) => {
  const res = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  )

  return res.rows[0] ?? null;
}

export const createTenant = async (name: string, client?: PoolClient): Promise<Tenant> => {
  const db = client || pool;
  const res = await db.query(
    `INSERT INTO tenants (name) VALUES ($1)
         RETURNING
         id,
         name,
         created_at AS "createdAt"`,
    [name]
  )
  return res.rows[0] ?? null;
}

export const creatUser = async (input: CreateUserInput, client?: PoolClient): Promise<UserPublic> => {
  const db = client || pool;
  const res = await db.query<UserPublic>(
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