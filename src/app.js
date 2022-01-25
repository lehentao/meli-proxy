const express = require('express');
const displayRoutes = require('express-routemap');
const fs = require('fs');
const app = express();

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