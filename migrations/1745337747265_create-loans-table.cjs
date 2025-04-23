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
    pgm.createTable('loans', {
        id: 'id',
        book_id: {
          type: 'integer',
          notNull: true,
          references: '"books"',
          onDelete: 'cascade'
        },
        user_id: {
          type: 'integer',
          notNull: true,
          references: '"users"',
          onDelete: 'cascade'
        },
        loan_date: {
          type: 'date',
          notNull: true,
          default: pgm.func('CURRENT_DATE')
        },
        due_date: {
          type: 'date',
          notNull: true
        },
        return_date: {
          type: 'date',
          notNull: false
        }
      });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('loans');
};
