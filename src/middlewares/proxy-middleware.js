const { getReqData, filterRoutes } = require('../helpers/helpers');
const { callService } = require('../service/call-service');

async function proxyMiddleware(req, res) {
  const method = req.method.toLowerCase();
  const reqData = getReqData(req);
  const filteredRouters = filterRoutes(method, reqData)
  req.transaction.request = reqData;
  if (filteredRouters.length === 0) {
    req.transaction.response = {
      success: false,
      statusCode: 404
    }
    return res.status(404).send({ message: 'Route not found' })
  }
  const response = await callService(method, filteredRouters[0], req);
  req.transaction.response = response.resStatus;
  req.transaction.routedTo = response.routedTo;
  return res.status(response.resStatus.statusCode).send(response.data)
}

module.exports = { proxyMiddleware };