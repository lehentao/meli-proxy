const express = require('express');
const displayRoutes = require('express-routemap');
const fs = require('fs');
const http = require('http');
const rateLimit = require('express-rate-limit');
const RequestLimiter = require('express-request-limiter');
const config = require('express-request-limiter');
const app = express();
const server = http.createServer(app);
const { saveTransactionInterceptor } = require('./interseptors/save-transaction-interceptor')
const admin = require("firebase-admin");
const { getDatabase } = require('firebase-admin/database');
const { setConfig } = require('./configs/configs');
const serviceAccount = require(process.env.FIREBASE_ADMIN_KEY || '../firebase-admin-key.json');
console.log(JSON.stringify(serviceAccount))
// Initialize DB

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://meli-proxy-2c726-default-rtdb.firebaseio.com"
});

const db = getDatabase();
const ref = db.ref(`/configs`)

ref.once("value", function (snapshot) {
  const configs = snapshot.val();
  setConfig(configs)
  // Rate Limit
  if (config.rateLimit) {
    // Global
    if (config.rateLimit.global) {
      const limiter = rateLimit({
        windowMs: config.rateLimit.global.time,
        max: config.rateLimit.global.maxCnx,
        standardHeaders: true,
        legacyHeaders: false
      })
      app.use(limiter)
    }
    // By Path
    config.rateLimit.paths((rl) => {
      const limiter = rateLimit({
        windowMs: rl.time,
        max: rl.maxCnx,
        standardHeaders: true,
        legacyHeaders: false
      })
      app.use(rl.path, limiter)
    })
  }

  // Request Limit 
  if (config.requestLimiter) {
    config.requestLimiter.forEach((rl) => {
      const requestLimiter = RequestLimiter({
        maxRequests: rl.maxRequests,
        headers: true,
        routesList: rl.routesList,
      });
      app.use(requestLimiter);
    })
  }
});


const port = process.env.PORT || 5000;


app.use(saveTransactionInterceptor)


app.use('/', require('./routes'));
// Handle 404
app.use((req, res) => {
  res.status(404).send('Route not Found');
});

// Handle 500
app.use((error, req, res) => {
  logger.error('Internal Server Error: %s', error);
  res.status(500).send('500: Internal Server Error');
});
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
  displayRoutes(app);
});

server.on('error', onError);
server.on('listening', onListening);

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
}

exports.closeServer = function () {
  server.close();
};
