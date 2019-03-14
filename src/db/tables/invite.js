const { client } = require('../');

module.exports = client.query(`
    CREATE TABLE IF NOT EXISTS "invite" (
        user_id       INT NOT NULL,
        user_to_id    INT NOT NULL,
        dialogue_id   INT NOT NULL REFERENCES dialogue(id) ON DELETE CASCADE,
        created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, user_to_id, dialogue_id)
    );
`);
