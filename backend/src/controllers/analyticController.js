const Analytic = require('../models/analytic');
const io = require('socket.io');

module.exports = {
    getById: function (req, res, next) {
        console.log('getById');
    },
    getAll: function (req, res, next) {
        console.log('getAll');
    },
    updateById: function (req, res, next) {
        console.log('updateById');
    },
    deleteById: function (req, res, next) {
        console.log('deleteById');
    },
    create: function (req, res, next) {
        Analytic.create(req.body, function (err) {
            if (err)
                res.status(500).json({ status: "Error", message: "Erro !!!", data: null });
            else {
                res.json({ status: "Success", message: "Sucesso !!!", data: '' });
            }
        });
    },
}