const { client } = require('../');

const name = 'message';

const message = client.query(
  `CREATE TABLE IF NOT EXISTS ${name} (
    id              SERIAL,
    dialogue_id     INT NOT NULL REFERENCES dialogue(id) ON DELETE CASCADE,
    owner_id        INT NOT NULL,
    body            TEXT NOT NULL,
    is_delivered    BOOLEAN DEFAULT FALSE,
    is_seen         BOOLEAN DEFAULT FALSE,
    delivered_at    TIMESTAMP,
    seen_at         TIMESTAMP,
    has_media       BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (id)
  );`,
);

module.exports = { message };
