const { pool } = require('../index');
const { logger } = require('../../logger');

const message = {
  create: async (dialogue, owner, body, media) => {
    try {
      const client = await pool.connect();
      const { rows } = await client.query(
        `INSERT INTO message (
          dialogue_id,
          owner_id,
          body,
          has_media
        ) VALUES (
          $1, $2, $3, $4
        ) RETURNING *;`,
        [dialogue, owner, body, media],
      );

      await client.release();
      return rows[0];
    } catch (error) {
      return logger.error(error);
    }
  },

  get: {
    by: {
      id: async (id) => {
        try {
          const client = await pool.connect();
          const { rows } = await client.query(
            'SELECT * FROM message WHERE id = $1',
            [id],
          );

          await client.release();
          return rows[0];
        } catch (error) {
          return logger.error(error);
        }
      },

      owner: async (owner) => {
        try {
          const client = await pool.connect();
          const { rows } = await client.query(
            'SELECT * FROM message WHERE owner_id = $1',
            [owner],
          );

          await client.release();
          return rows;
        } catch (error) {
          return logger.error(error);
        }
      },
    },
  },

  update: {
    body: async (id, body) => {
      try {
        const client = await pool.connect();
        const { rows } = await client.query(
          'UPDATE message SET body = $1 WHERE id = $2 RETURNING *;',
          [body, id],
        );

        await client.release();
        return rows[0];
      } catch (error) {
        return logger.error(error);
      }
    },

    delivered: async (id, at) => {
      try {
        const client = await pool.connect();
        const { rows } = await client.query(
          'UPDATE message SET is_delivered = TRUE, delivered_at = $1 WHERE id = $2 RETURNING *;',
          [at, id],
        );

        await client.release();
        return rows[0];
      } catch (error) {
        return logger.error(error);
      }
    },

    seen: async (id, at) => {
      try {
        const client = await pool.connect();
        const { rows } = await client.query(
          'UPDATE message SET is_seen = TRUE, seen_at = $1 WHERE id = $2 RETURNING *;',
          [at, id],
        );

        await client.release();
        return rows[0];
      } catch (error) {
        return logger.error(error);
      }
    },
  },

  remove: async (id) => {
    try {
      const client = await pool.connect();
      const { rows } = await client.query(
        'DELETE FROM message WHERE id = $1 RETURNING *;',
        [id],
      );

      await client.release();
      return rows[0];
    } catch (error) {
      return logger.error(error);
    }
  },
};

module.exports = { message };
