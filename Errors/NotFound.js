const { Status } = require('../utils/status');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = Status.NOT_FOUND;
  }
}

module.exports = NotFoundError;
