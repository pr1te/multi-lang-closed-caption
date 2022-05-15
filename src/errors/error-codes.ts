import Status from 'http-status';

export default Object.freeze({
  NotFound: {
    code: 'ERR_NOT_FOUND',
    httpStatus: Status.NOT_FOUND,
  },

  InternalServerError: {
    code: 'ERR_INTERNAL_SERVER_ERROR',
    httpStatus: Status.INTERNAL_SERVER_ERROR,
  },
});
