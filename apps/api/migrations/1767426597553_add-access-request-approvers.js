/**
 * @type {import('node-pg-migrate').MigrationBuilder}
 */
exports.up = pgm => {
  // 1. Drop single-approver columns
  pgm.dropColumn('access_requests', 'approved_by', { ifExists: true });
  pgm.dropColumn('access_requests', 'approved_at', { ifExists: true });

  // 2. Create approval_status enum (safe)
  pgm.createType('approval_status', ['PENDING', 'APPROVED', 'REJECTED'], {
    ifNotExists: true
  });

  // 3. Create access_request_approvers table
  pgm.createTable('access_request_approvers', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()')
    },

    access_request_id: {
      type: 'uuid',
      notNull: true,
      references: '"access_requests"',
      onDelete: 'CASCADE'
    },

    approver_id: {
      type: 'uuid',
      notNull: true,
      references: '"users"'
    },

    status: {
      type: 'approval_status',
      notNull: true,
      default: 'PENDING'
    },

    acted_at: {
      type: 'timestamp'
    }
  });

  // 4. Prevent duplicate approvers per request
  pgm.addConstraint(
    'access_request_approvers',
    'unique_request_approver',
    {
      unique: ['access_request_id', 'approver_id']
    }
  );
};

/**
 * @type {import('node-pg-migrate').MigrationBuilder}
 */
exports.down = pgm => {
  // 1. Drop approvers table
  pgm.dropTable('access_request_approvers', { ifExists: true });

  // 2. Drop enum
  pgm.dropType('approval_status', { ifExists: true });

  // 3. Restore single-approver columns
  pgm.addColumn('access_requests', {
    approved_by: {
      type: 'uuid',
      references: '"users"'
    },
    approved_at: {
      type: 'timestamp'
    }
  });
};
