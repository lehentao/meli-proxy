const express = require('express');

const RequestLimiter = require('express-request-limiter');
const { proxyMiddleware } = require('../middlewares/proxy-middleware')
const router = express.Router();

router.get(/.*/, proxyMiddleware);
router.post(/.*/, proxyMiddleware);
router.put(/.*/, proxyMiddleware);
router.patch(/.*/, proxyMiddleware);
router.delete(/.*/, proxyMiddleware);
router.options(/.*/, proxyMiddleware);
router.head(/.*/, proxyMiddleware);


module.exports = router;