const interceptor = require('express-interceptor');

const saveTransactionInterceptor = interceptor((req, res) => {
  return {
    isInterceptable() {
      return /application\/json/.test(res.get('Content-Type'));
    },
    intercept(data, send) {
      console.log(req.transaction)
      send(data);
    }
  };
});

module.exports = { saveTransactionInterceptor }