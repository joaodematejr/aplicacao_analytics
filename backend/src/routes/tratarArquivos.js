//Fonte
//https://medium.com/@joaogabriellima/an%C3%A1lise-explorat%C3%B3ria-de-dados-com-javascript-parte-1-manipula%C3%A7%C3%A3o-de-dados-81c8471685c7

var dataForge = require('data-forge');
require('data-forge-fs');
require('data-forge-plot');

module.exports = (app, io) => {
    let route = app.route('/tratarArquivos');
    //TRATAR DADOS
    route.post((req, res) => {
        let dataFrame = dataForge.readFileSync('/Volumes/Documentos/facu/projetos/aplicacao_analytics/backend/csv/01.csv').parseCSV();
        let arrayOfObjs = dataFrame.toArray();
        console.log(arrayOfObjs);
        res.status(200).json({ status: "Sucesso", message: arrayOfObjs, data: null });
    });
}
