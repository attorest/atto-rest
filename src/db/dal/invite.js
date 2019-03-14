const { pool } = require('../index');
const { logger } = require('../../logger');

const invite = {
  create: async (inviter, invited, dialogue) => {
    try {
      const client = await pool.connect();
      const { rows } = await client.query(
        `INSERT INTO invite (
          user_id,
          user_to_id,
          dialogue_id
        ) VALUES (
          $1, $2, $3
        ) RETURNING *;`,
        [inviter, invited, dialogue],
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
            'SELECT * FROM invite WHERE id = $1',
            [id],
          );

          await client.release();
          return rows[0];
        } catch (error) {
          return logger.error(error);
        }
      },

      inviter: async (inviter) => {
        try {
          const client = await pool.connect();
          const { rows } = await client.query(
            'SELECT * FROM invite WHERE user_id = $1',
            [inviter],
          );

          await client.release();
          return rows;
        } catch (error) {
          return logger.error(error);
        }
      },

      invited: async (invited) => {
        try {
          const client = await pool.connect();
          const { rows } = await client.query(
            'SELECT * FROM invite WHERE user_to_id = $1',
            [invited],
          );

          await client.release();
          return rows;
        } catch (error) {
          return logger.error(error);
        }
      },
    },
  },

  remove: async (id) => {
    try {
      const client = await pool.connect();
      const { rows } = await client.query(
        'DELETE FROM invite WHERE id = $1 RETURNING *;',
        [id],
      );

      await client.release();
      return rows[0];
    } catch (error) {
      return logger.error(error);
    }
  },
};

module.exports = { invite };
