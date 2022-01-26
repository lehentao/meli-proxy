const interceptor = require('express-interceptor');
const moment = require('moment');
const { getDatabase } = require('firebase-admin/database');

const saveTransactionInterceptor = interceptor((req, res) => {
  return {
    isInterceptable() {
      return /application\/json/.test(res.get('Content-Type'));
    },
    intercept(data, send) {
      const current = moment()
      req.transaction.endTime = current.unix()

      // Get a database reference to our blog
      const db = getDatabase();
      const ref = db.ref(`/log/${current.format("YYYYMM")}`)
      ref.push().set(req.transaction)
      send(data);
    }
  };
});

module.exports = { saveTransactionInterceptor }