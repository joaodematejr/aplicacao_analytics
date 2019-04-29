var mongoose = require('mongoose');

const analyticSchema = mongoose.Schema({
    informacao: { type: String, required: false },
})

module.exports = mongoose.model('Analytic', analyticSchema)
