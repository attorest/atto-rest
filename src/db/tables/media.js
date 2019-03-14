const { client } = require('../index');

const name = 'media';

const media = client.query(
  `CREATE TABLE IF NOT EXISTS ${name} (
    id            SERIAL,
    owner_id      INT NOT NULL,
    message_id    INT NOT NULL REFERENCES message(id) ON DELETE RESTRICT,
    media_type    TEXT NOT NULL,
    plain_value   TEXT NOT NULL,
    raw_value     JSONB,
    PRIMARY KEY (id)
  );`,
);

module.exports = { media };
