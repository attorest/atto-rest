const { client } = require('../index');

const { logger } = require('../../logger');

const { dialogue } = require('./dialogue');
const { message } = require('./message');
const { media } = require('./media');
const invite = require('./invite');

client.connect().catch(error => logger.error(error));

module.exports = Promise.all([dialogue, message, media, invite])
  .then((results) => {
    logger.info('TABLES SUCCESSFULLY CREATED!');
    client.end();
    return results;
  })
  .catch((error) => {
    logger.error(error);
    client.end();
  });
