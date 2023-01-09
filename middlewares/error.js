import { constants } from 'http2';
import { messageServerError } from '../errors/constants.js';

export const middleError = (err, req, res, next) => {
  const status = err.statusCode || constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
  const message = err.message || messageServerError;
  res.status(status).send({ message });
  next();
};
