const analyticsRoutes = require('../routes/analyticsRoutes');

module.exports = function (server) {
    server.use('/analytics', analyticsRoutes);
}