import atto from './atto';

import * as index from './routes/index';
import * as chats from './routes/chats';

export default atto({
    '/': index,
    '/chat': chats,
    '/template': null,
});
