const axios = require('axios');
const { getReqData } = require('../helpers/helpers');

async function callService(method, route, req) {
  const reqData = getReqData(req);
  const path = route.pathTransform ?
    reqData.originalUrl.replace(
      new RegExp(
        "^" + route.pathTransform.basepath.replace('/', '\\/')),
      route.pathTransform.replaceTo) :
    reqData.originalUrl;

  const url = `${route.routeTo.protocol || 'http'}://${route.routeTo.host}${route.routeTo.port ? ':' + route.routeTo.port : ''}${path}`;
  const headers = { ...req.headers };
  delete headers['content-length'];
  headers['host'] = route.routeTo.host;
  const options = { method, url, headers, data: req.body };
  const response = {}
  try {
    const respCall = await axios(options);
    response.data = respCall.data;
    response.resStatus = {
      success: true,
      statusCode: respCall.status
    }

  } catch (error) {
    if (error.response) {
      response.data = error.response.data
      response.resStatus = {
        success: false,
        statusCode: error.response.status
      }
    } else {
      response.data = { message: error.message }
      response.resStatus = {
        success: false,
        statusCode: 500
      }
    }
  } finally {
    response.routedTo = { url, method };
  }
  return response;
}

module.exports = { callService }