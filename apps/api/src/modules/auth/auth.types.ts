export type UserRole = 'ADMIN' | 'APPROVER' | 'USER';

export interface UserRow {
  id: string;
  tenant_id: string;
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  created_by: string | null;
  created_at: Date;
}

export interface CreateUserInput {
  tenantId: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdBy?: string;
}

export interface UserPublic {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

export interface Tenant {
  id: string;
  name: string;
  createdAt: Date;
}
