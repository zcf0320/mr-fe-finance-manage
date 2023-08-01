const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  // app.use('/api/mall-payment-e', createProxyMiddleware({
  //   target: 'http://172.16.13.115:11101',
  //   changeOrigin: true,
  //   pathRewrite: { '^/api/mall-payment-e': '' },
  // }));
  app.use('/api', createProxyMiddleware({
    target: 'https://boss-dev.fengyouhui.net/be/api',
    changeOrigin: true,
    pathRewrite: { '^/api': '' },
  }));
};