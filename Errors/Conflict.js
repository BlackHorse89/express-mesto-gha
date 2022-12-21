const { Status } = require('../utils/status');

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = Status.CONFLICT;
  }
}

module.exports = ConflictError;
