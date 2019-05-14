const Analytic = require('../models/analytic');

module.exports = (app, io) => {
    let route = app.route('/analytics');
    //METODO POST INSERIR DADOS
    route.post((req, res) => {
        Analytic.create(req.body, function (err, analytic) {
            if (err)
                res.status(500).json({ status: "Error", message: err.toString(), data: null });
            else {
                res.json({ status: "Sucesso", message: "Sucesso !!!", data: analytic });
                io.emit('analytics', { date: analytic });
            }
        });
    });
    //METODO GET RECUPERAR DADOS
    route.get((req, res) => {
        //db.user.distinct("name")
        Analytic.distinct('adm0_name').exec((err, widgets) => {
            if (err) {
                app.utils.error.send(err, req, res);
            } else {
                res.statusCode = 200;
                res.setHeader('Context-Type', 'application/json');
                res.json(widgets);
                console.log('widgets', widgets)
            }
        });
    });
    /*     //METODO GET RECUPERAR DADOS
        route.get((req, res) => {
            Analytic.find({ mp_year: 2014 }).sort({}).count((err, widgets) => {
                if (err) {
                    app.utils.error.send(err, req, res);
                } else {
                    res.statusCode = 200;
                    res.setHeader('Context-Type', 'application/json');
                    res.json(widgets);
                    console.log('widgets', widgets)
                }
            });
        }); */

    /*      //METODO GET RECUPERAR DADOS
         route.get((req, res) => {
            Analytic.find({}).sort({}).exec((err, widgets) => {
                if (err) {
                    app.utils.error.send(err, req, res);
                } else {
                    res.statusCode = 200;
                    res.setHeader('Context-Type', 'application/json');
                    res.json(widgets);
                    console.log('widgets', widgets)
                }
            });
        }); */
}
