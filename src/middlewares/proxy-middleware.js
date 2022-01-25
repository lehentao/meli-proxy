const { getReqData, filterRoutes } = require('../helpers/helpers');
const { callService } = require('../service/call-service');

function proxyMiddleware(req, res) {
  const method = req.method.toLowerCase();
  const reqData = getReqData(req)
  const filteredRouters = filterRoutes(method, reqData)
  if (filteredRouters.length === 0) {
    return res.status(404).send({ message: 'Route not found' })
  }
  return callService(method, reqData, filteredRouters[0], res);
}

module.exports = { proxyMiddleware };