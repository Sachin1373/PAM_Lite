exports.up = pgm => {
  pgm.addColumn('applications', {
    auth_config: { type: 'jsonb', notNull: true }
  });
};

exports.down = pgm => {
  pgm.dropColumn('applications', 'auth_config');
};