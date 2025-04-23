const bcrypt = require('bcrypt');

/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.up = async (pgm) => {
  pgm.createTable("users", {
    id: "id",
    name: { type: "varchar(100)", notNull: true },
    email: { type: "varchar(100)", notNull: true, unique: true },
    password: { type: "text", notNull: true },
    is_admin: { type: "boolean", notNull: true, default: false },
  });

  const hashedPassword = await bcrypt.hash("password", 10);

  await pgm.sql`
    INSERT INTO users (name, email, password, is_admin)
    VALUES (
      'admin',
      'admin@gmail.com',
      ${hashedPassword},
      true
    )
  `;
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.down = (pgm) => {
  pgm.dropTable("users");
};
