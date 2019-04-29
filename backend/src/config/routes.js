const analyticsRoutes = require('../routes/analyticsRoutes');

module.exports = function (server, io) {
    server.use('/analytics', analyticsRoutes);
}
