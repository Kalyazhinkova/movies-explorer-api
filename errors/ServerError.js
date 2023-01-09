import { constants } from 'http2';
import { HTTPError } from './HTTPError.js';
import { messageServerError } from './constants.js';

export class ServerError extends HTTPError {
  constructor(message) {
    super(`${messageServerError} ${message}`, constants.HTTP_STATUS_SERVICE_UNAVAILABLE);
  }
}
