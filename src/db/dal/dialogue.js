const { pool } = require('../index');
const { logger } = require('../../logger');

const dialogue = {
  create: async (owner, partner, pinned, muted, secret) => {
    try {
      const client = await pool.connect();
      const { rows } = await client.query(
        `INSERT INTO dialogue (
          owner_id,
          partner_id,
          is_pinned,
          is_muted,
          is_secret
        ) VALUES (
          $1, $2, $3, $4, $5
        ) RETURNING *;`,
        [owner, partner, pinned, muted, secret],
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
            'SELECT * FROM dialogue WHERE id = $1;',
            [id],
          );

          await client.release();
          return rows;
        } catch (error) {
          return logger.error(error);
        }
      },

      owner: async (owner) => {
        try {
          const client = await pool.connect();
          const { rows } = await client.query(
            'SELECT * FROM dialogue WHERE owner_id = $1;',
            [owner],
          );

          await client.release();
          return rows;
        } catch (error) {
          return logger.error(error);
        }
      },

      partner: async (partner) => {
        try {
          const client = await pool.connect();
          const { rows } = await client.query(
            'SELECT * FROM dialogue WHERE partner_id = $1;',
            [partner],
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
    pinned: async (id, pinned) => {
      try {
        const client = await pool.connect();
        const { rows } = await client.query(
          'UPDATE dialogue SET is_pinned = $1 WHERE id = $2 RETURNING *;',
          [pinned, id],
        );

        await client.release();
        return rows[0];
      } catch (error) {
        return logger.error(error);
      }
    },

    muted: async (id, muted) => {
      try {
        const client = await pool.connect();
        const { rows } = await client.query(
          'UPDATE dialogue SET is_muted = $1 WHERE id = $2 RETURNING *;',
          [muted, id],
        );

        await client.release();
        return rows[0];
      } catch (error) {
        return logger.error(error);
      }
    },

    secret: async (id, secret) => {
      try {
        const client = await pool.connect();
        const { rows } = await pool.query(
          'UPDATE dialogue SET is_secret = $1 WHERE id = $2 RETURNING *;',
          [secret, id],
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
        'DELETE FROM dialogue WHERE id = $1 RETURNING *;',
        [id],
      );

      await client.release();
      return rows[0];
    } catch (error) {
      return logger.error(error);
    }
  },
};

module.exports = { dialogue };
