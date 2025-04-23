/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  // Create the categories table
  pgm.createTable('categories', {
    id: 'serial PRIMARY KEY',
    name: { type: 'varchar(255)', notNull: true }, // Add any other columns you need
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  // Drop the categories table if rolling back the migration
  pgm.dropTable('categories');
};
