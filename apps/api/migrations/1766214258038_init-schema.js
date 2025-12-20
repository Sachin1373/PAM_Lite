export async function up(pgm) {
  pgm.sql(`
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";

    CREATE TABLE tenants (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT now()
    );

    CREATE TYPE user_role AS ENUM ('ADMIN', 'APPROVER', 'USER');

    CREATE TABLE users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

      name TEXT NOT NULL,
      email TEXT NOT NULL,
      password_hash TEXT NOT NULL,

      role user_role NOT NULL,

      created_by UUID REFERENCES users(id),
      created_at TIMESTAMP DEFAULT now(),

      UNIQUE (tenant_id, email)
    );

    CREATE TYPE app_type AS ENUM ('DATABASE', 'WEB');

    CREATE TABLE applications (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

      name TEXT NOT NULL,
      type app_type NOT NULL,

      target_url TEXT NOT NULL,
      description TEXT,

      created_by UUID REFERENCES users(id),
      created_at TIMESTAMP DEFAULT now()
    );

    CREATE TYPE request_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

    CREATE TABLE access_requests (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

      user_id UUID NOT NULL REFERENCES users(id),
      application_id UUID NOT NULL REFERENCES applications(id),

      reason TEXT,
      duration_minutes INT NOT NULL,

      status request_status DEFAULT 'PENDING',

      requested_at TIMESTAMP DEFAULT now(),
      approved_by UUID REFERENCES users(id),
      approved_at TIMESTAMP
    );

    CREATE TYPE session_status AS ENUM ('ACTIVE', 'EXPIRED', 'REVOKED');

    CREATE TABLE sessions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

      user_id UUID NOT NULL REFERENCES users(id),
      application_id UUID NOT NULL REFERENCES applications(id),
      access_request_id UUID REFERENCES access_requests(id),

      status session_status DEFAULT 'ACTIVE',

      start_time TIMESTAMP DEFAULT now(),
      expires_at TIMESTAMP NOT NULL
    );

    CREATE TABLE audit_logs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      tenant_id UUID NOT NULL REFERENCES tenants(id),

      user_id UUID REFERENCES users(id),
      action TEXT NOT NULL,
      resource_type TEXT,
      resource_id UUID,

      metadata JSONB,
      created_at TIMESTAMP DEFAULT now()
    );
  `);
}

export async function down(pgm) {
  pgm.sql(`
    DROP TABLE IF EXISTS audit_logs;
    DROP TABLE IF EXISTS sessions;
    DROP TABLE IF EXISTS access_requests;
    DROP TABLE IF EXISTS applications;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS tenants;

    DROP TYPE IF EXISTS session_status;
    DROP TYPE IF EXISTS request_status;
    DROP TYPE IF EXISTS app_type;
    DROP TYPE IF EXISTS user_role;
  `);
}
