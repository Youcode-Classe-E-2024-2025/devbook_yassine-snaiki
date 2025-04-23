/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
    pgm.createTable('books', {
        id: 'id',
        title: { type: 'varchar(255)', notNull: true },
        author: { type: 'varchar(100)' },
        category_id: {
          type: 'integer',
          references: '"categories"',
          onDelete: 'set null',
        },
        status: {
          type: 'varchar(10)',
          notNull: true,
          default: 'available',
          check: "status IN ('available', 'borrowed')"
        }
      });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('books');
};
