const axios = require('axios');

async function callService(method, reqData, route, res) {
  const path = route.pathTransform ?
    reqData.originalUrl.replace(
      new RegExp(
        "^" + route.pathTransform.basepath.replace('/', '\\/')),
      route.pathTransform.replaceTo) :
    reqData.originalUrl;

  const url = `${route.routeTo.protocol || 'http'}://${route.routeTo.host}${route.routeTo.port ? ':' + route.routeTo.port : ''}${path}`;

  try {
    const response = await axios({ method, url });
    return res.status(response.status).send(response.data);
  } catch (error) {
    return res.status(error.response.status).send(error.response.data);
  }
}

module.exports = { callService }