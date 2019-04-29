const port = 9000
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const app = express();

require('./src/config/mongodb')

app.use(bodyParser.urlencoded({ limit: '1mb', extended: true }));
app.use(bodyParser.json({ limit: '1mb', extended: true }));
app.use(cors());

const http = require('http').createServer(app);
const io = require('socket.io')(http);

//SOCKET IO
io.on('connection', socket => {
    console.log('Usuário conectado via socket :)')

    socket.on('disconnect', () => {
        console.log('Usuário desconectado :(')
    })

    socket.emit('analytics', {
        date: new Date()
    });

})

//ROTAS DA APLICAÇÃO
require('./src/config/routes')(app, io);

http.listen(port, function () {
    console.log(`servidor rodando na porta ${port}.`)
})
