const moment = require('moment');

function initCallMiddleware(req, res, next) {
  req.transaction = {
    initTimestamp: moment().unix()
  }
  next();
}
module.exports = { initCallMiddleware }