//Fonte Análise Exploratória de Dados com Javascript — Parte 1 : Manipulação de Dados
//https://medium.com/@joaogabriellima/an%C3%A1lise-explorat%C3%B3ria-de-dados-com-javascript-parte-1-manipula%C3%A7%C3%A3o-de-dados-81c8471685c7

var dataForge = require('data-forge');
require('data-forge-fs');
require('data-forge-plot');

module.exports = (app) => {
    let route = app.route('/localizarArquivo');
    //LISTAR COLUNAS CSV
    route.post((req, res) => {
        var arquivoCSV = dataForge.readFileSync('/Volumes/Documentos/facu/projetos/aplicacao_analytics/backend/csv/wfp_market_food_prices.csv').parseCSV();
        let listaColunas = arquivoCSV.getColumnNames();
        res.status(200).json({ status: "Sucesso", message: "Lista de Colunas Localizada", data: listaColunas });
    });

    //IMPORTAR CSV
    let importCsv = app.route('/importCsv');
    importCsv.post((req, res) => {
        listaColunhas = []

        req.body.listaColunasCSV.forEach(element => {
            listaColunhas.push(element.colunas)
        });

        var arquivoCSV = dataForge.readFileSync('/Volumes/Documentos/facu/projetos/aplicacao_analytics/backend/csv/wfp_market_food_prices.csv').parseCSV();
        var newDf = arquivoCSV.dropSeries(listaColunhas);

        console.log(newDf.between(0, 2).toString());
        res.status(200).json({ status: "Sucesso", message: 'Concluido Com Sucesso', data: newDf.between(0, 2).toString() });
    });
}
