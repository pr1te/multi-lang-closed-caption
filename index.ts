import 'dotenv/config';

import { createTerminus } from '@godaddy/terminus';

import app from '~/app';
import config from '~/config';
import logger from '~/lib/logger';

const { port, version } = config;
const server = app.listen(port);

// gracegul shutdown
createTerminus(server, {
  signals: [ 'SIGINT', 'SIGTERM', 'SIGUSR2' ],

  healthChecks: { '/healthz': () => Promise.resolve() },

  // cleanup function, returning a promise (used to be onSigterm)
  onSignal () {
    logger.log('closing connection pool');

    return Promise.all([]);
  },

  onShutdown () {
    logger.log('Shutting down application');

    return Promise.resolve();
  },
});

process.on('unhandledRejection', (reason, p) => {
  logger.error('Unhandled Rejection at: Promise ', p, reason);
});

logger.clear();

logger.log('--------------------------------------------');
logger.log(`multi_lang_closed-caption@${version} started`);
logger.log(`Listening at http://localhost:${port}`);
logger.log('--------------------------------------------');

logger.debug('Debug mode is enabled.');
