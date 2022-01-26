const ipRangeCheck = require("ip-range-check");
const configs = require('../../route-config.json');
const routesConfig = configs.routes;

function validateIP(ip, originIPs) {
  if (!originIPs || originIPs.length === 0) {
    return true;
  }
  originIPs.forEach((oIP) => {
    // segment
    if (oIP.includes('/')) {
      if (ipRangeCheck(ip, oIP)) {
        return true;
      }
    }
    else if (oIP === ip) {
      return true
    }
  })
  return true;
}

function filterRoutes(method, data) {
  return routesConfig.filter((r) => {
    return r.methods.includes(method) &&
      data.originalUrl.startsWith(r.path) &&
      validateIP(data.ip, r.originIps) &&
      (!r.hosts || r.hosts.includes(data.host.split(":")[0]));
  })
}

function getReqData(req) {
  return {
    protocol: req.protocol,
    method: req.method,
    ip: req.clientIp || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    host: req.headers['host'],
    originalUrl: req.originalUrl,
    userAgent: req.headers['user-agent']
  }
}

module.exports = {
  filterRoutes,
  getReqData
}