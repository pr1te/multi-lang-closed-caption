import { INTERNAL_SERVER_ERROR } from 'http-status';
import { Request, Response, NextFunction } from 'express';

import errorCodes from '~/errors/error-codes';
import { ErrorResponsePayload } from '~/declaration.d';
import { NotFound, InternalServerError } from '~/errors';

export default {
  handler (env: string) {
    // Error handler must have 4 parameter
    // read more http://expressjs.com/en/guide/error-handling.html#the-default-error-handler
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return (err: any, req: Request, res: Response, next: NextFunction) => { // eslint-disable-line no-unused-vars
      const {
        type = InternalServerError.name,
        message,
        code,
        errors = [],
        stack,
      } = err;

      const status = (errorCodes[type as keyof typeof errorCodes] || {}).httpStatus || INTERNAL_SERVER_ERROR;
      const response: ErrorResponsePayload = { type, code, status, message, errors };

      if (env !== 'prod') response.stack = stack;

      console.error(err);
      res.status(status).json(response);
    };
  },

  notFound () {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        throw new NotFound('Not found the resource');
      } catch (error) {
        next(error);
      }
    };
  },
};
