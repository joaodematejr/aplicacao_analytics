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
        Analytic.distinct('adm0_name').exec((err, paises) => {
            if (err) {
                app.utils.error.send(err, req, res);
            } else {
                res.statusCode = 200;
                res.setHeader('Context-Type', 'application/json');
                res.json(paises);
            }
        });
    });
    //ROTA QUANTIDADE DE LINHAS
    let routeAnalyticsLinhas = app.route('/routeAnalyticsLinhas');
    routeAnalyticsLinhas.get((req, res) => {
        res.status(200).json({ status: "Informação Localizada", message: 'Informação Localizada com Sucesso', data: '740' });
    });
    //ROTA QUANTIDADE DE CIDADES
    let routeAnalyticsKM = app.route('/routeAnalyticsKM');
    routeAnalyticsKM.get((req, res) => {
        Analytic.distinct('adm1_name').exec((err, cidades) => {
            if (err) {
                app.utils.error.send(err, req, res);
            } else {
                res.statusCode = 200;
                res.setHeader('Context-Type', 'application/json');
                res.json(cidades);
            }
        });
    });
    //QUANTIDADE GERAL
    let routeAnalyticsTotal = app.route('/routeAnalyticsTotal');
    routeAnalyticsTotal.get((req, res) => {
        Analytic.find().count((err, quantidades) => {
            if (err) {
                app.utils.error.send(err, req, res);
            } else {
                res.statusCode = 200;
                res.setHeader('Context-Type', 'application/json');
                res.json(quantidades);
            }
        });
    });
    //TIPOS DE ALIMENTOS
    let routeAnalyticsTotalAlimentos = app.route('/routeAnalyticsTotalAlimentos');
    routeAnalyticsTotalAlimentos.get((req, res) => {
        Analytic.distinct('cm_name').exec((err, alimentos) => {
            if (err) {
                app.utils.error.send(err, req, res);
            } else {
                res.statusCode = 200;
                res.setHeader('Context-Type', 'application/json');
                res.json(alimentos);
            }
        });
    });
}
