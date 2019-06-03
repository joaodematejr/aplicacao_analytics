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
    //ROTA QUANTIDADE DE PROVINCIA
    let routeAnalyticsKM = app.route('/routeAnalyticsKM');
    routeAnalyticsKM.get((req, res) => {
        Analytic.distinct('adm1_name').exec((err, província) => {
            if (err) {
                app.utils.error.send(err, req, res);
            } else {
                res.statusCode = 200;
                res.setHeader('Context-Type', 'application/json');
                res.json(província);
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
    //QUANTIDADE DE CIDADES
    let routeAnalyticsTotalCidades = app.route('/routeAnalyticsTotalCidades');
    routeAnalyticsTotalCidades.get((req, res) => {
        Analytic.distinct('mkt_name').exec((err, cidades) => {
            if (err) {
                app.utils.error.send(err, req, res);
            } else {
                res.statusCode = 200;
                res.setHeader('Context-Type', 'application/json');
                res.json(cidades);
            }
        });
    });
    //METODO GET ANO
    let routeAnalyticsAno = app.route('/routeAnalyticsAno');
    routeAnalyticsAno.get((req, res) => {
        Analytic.distinct('mp_year').exec((err, ano) => {
            if (err) {
                app.utils.error.send(err, req, res);
            } else {
                res.statusCode = 200;
                res.setHeader('Context-Type', 'application/json');
                res.json(ano);
            }
        });
    });
    //FILTRO POR PAIS
    let routeAnalyticsPais = app.route('/routeAnalyticsPais');
    routeAnalyticsPais.post((req, res) => {
        Analytic.find({ adm0_name: req.body.pais }, { pt_name: 0, _id: 0, um_id: 0, um_name: 0, mp_commoditysource: 0, adm0_id: 0, adm1_id: 0, mkt_id: 0, cm_id: 0, adm1_name: 0, mkt_name: 0, cur_id: 0, cur_name: 0, cm_name: 0, pt_id: 0 }).exec((err, pais) => {
            if (err) {
                app.utils.error.send(err, req, res);
            } else {
                res.json({ status: "Pais Localizado", message: "Pais Localizado", data: pais });
            }
        });
    });
}
