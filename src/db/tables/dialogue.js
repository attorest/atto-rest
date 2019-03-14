const { client } = require('../index');

const name = 'dialogue';

const dialogue = client.query(
  `CREATE TABLE IF NOT EXISTS ${name} (
    id            SERIAL,
    owner_id      INT NOT NULL,
    partner_id    INT NOT NULL,
    preview       TEXT DEFAULT NULL,
    is_pinned     BOOLEAN NOT NULL DEFAULT FALSE,
    is_muted      BOOLEAN NOT NULL DEFAULT FALSE,
    is_secret     BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (id)
  );`,
);

module.exports = { dialogue };
