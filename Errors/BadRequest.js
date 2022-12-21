const { Status } = require('../utils/status');

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = Status.BAD_REQUEST;
  }
}

module.exports = BadRequestError;
