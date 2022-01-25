const express = require('express');
const displayRoutes = require('express-routemap');
const fs = require('fs');
const http = require('http');
const app = express();
const server = http.createServer(app);

const port = process.env.SERVER_PORT || 5000;
app.use('/', require('./routes'));
// Handle 404
app.use((req, res) => {
  res.status(404).send('Route not Found');
});

app.get('/config-data', (req, res) => {
  //fs.readFile('../route-config.yml');
  res.sendFile(`${__dirname}/route-config.yml`)
})

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
