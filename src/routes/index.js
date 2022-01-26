const express = require('express');
const { initCallMiddleware } = require('../middlewares/init-call-middleware');

const { proxyMiddleware } = require('../middlewares/proxy-middleware')
const router = express.Router();

router.get(/.*/, initCallMiddleware, proxyMiddleware);
router.post(/.*/, initCallMiddleware, proxyMiddleware);
router.put(/.*/, initCallMiddleware, proxyMiddleware);
router.patch(/.*/, initCallMiddleware, proxyMiddleware);
router.delete(/.*/, initCallMiddleware, proxyMiddleware);
router.options(/.*/, initCallMiddleware, proxyMiddleware);
router.head(/.*/, initCallMiddleware, proxyMiddleware);


module.exports = router;