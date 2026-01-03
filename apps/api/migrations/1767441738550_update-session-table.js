exports.up = (pgm) => {
  pgm.addColumns('sessions', {
    token: {
      type: 'varchar(255)',
      notNull: true,
      unique: true,
    },

    is_active: {
      type: 'boolean',
      default: true,
      notNull: true,
    },

    target_url: {
      type: 'text',
      notNull: true,
    },

    auth_config: {
      type: 'jsonb',
      notNull: true,
    },

    last_accessed: {
      type: 'timestamp',
    },
  })
}

exports.down = (pgm) => {
  pgm.dropColumns('sessions', [
    'token',
    'is_active',
    'target_url',
    'auth_config',
    'last_accessed',
  ])
}
