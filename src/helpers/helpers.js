const ipRangeCheck = require("ip-range-check");
const yaml = require('yamljs')
const routesConfig = [
  {
    originIps: ['::ffff:127.0.0.1',],
    path: '/someroute/categories',
    pathTransform: {
      basepath: '/someroute',
      replaceTo: '/'
    },
    methods: ['get', 'post'],
    routeTo: {
      protocol: 'https',
      host: 'api.mercadolibre.com'
    }
  },
  {
    path: '/meli-api',
    hosts: ['localhost', 'my.host.local'],
    methods: ['get', 'put', 'patch', 'options'],
    routeTo: {
      protocol: 'https',
      host: '61eff8e2732d93001778e768.mockapi.io',
    },
    pathTransform: {
      basepath: '/meli-api',
      replaceTo: '/api'
    }
  }
]

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
    ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    host: req.headers['host'],
    originalUrl: req.originalUrl,
    userAgent: req.headers['user-agent'],
  }
}

module.exports = {
  filterRoutes,
  getReqData
}