import cors from 'cors';
import helmet from 'helmet';
import express from 'express';
import compression from 'compression';

import config from '~/config';
import error from '~/middlewares/error-handler';

// create express instance
const app = express();

// apply middleware
app.use(helmet());
app.use(cors({
  maxAge: 86400, // NOTICE: 1 day
  credentials: true,
  exposedHeaders: [ 'Authorization', 'Content-Type' ],
  origin: [ ...config.corsOriginWhitelist, /localhost/, /127.0.0.1/ ],
}));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// error handler
app.use(error.notFound());
app.use(error.handler(config.env));

export default app;
