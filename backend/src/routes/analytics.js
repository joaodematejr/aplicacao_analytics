const Analytic = require('../models/analytic');

module.exports = (app, io) => {
    let route = app.route('/analytics');
    //METODO GET
    route.get((req, res) => {
        Analytic.create(req.body, function (err, analytic) {
            if (err)
                res.status(500).json({ status: "Error", message: err.toString(), data: null });
            else {
                res.json({ status: "Sucesso", message: "Sucesso !!!", data: analytic });
                io.emit('analytics', { date: analytic });
            }
        });
    });
}