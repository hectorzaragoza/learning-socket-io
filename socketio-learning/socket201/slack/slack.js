const express = require('express')
const app = express();
const socketio = require('socket.io');
const { isRegExp } = require('util/types');

// Middleware to serve static files from public folder
app.use(express.static(__dirname + '/public'))

// Express setup
const expressServer = app.listen(9000)
// Hand Express server to socketio Server
const io = socketio(expressServer)

// .on is assuming main namespace... io.on === io.of('/').on
// You can use .of to specify a particular namespace

io.on('connection', (socket) => {
    // Emit is sending
    socket.emit('messageFromServer', {data: 'Welcome to the socketio server'})
    // .on for this socket is listening and receiving message from Client
    socket.on('messageToServer', (dataFromClient) => {
        console.log(dataFromClient)
    })
    socket.join('level1')
    io.of('/').to('level1').emit('joined', `${socket.id} saysI have joined level 1 room!`)
})

io.of('/admin').on('connection', (socket) => {
    console.log('Someone connected to the Admin Namespace!')
    io.of('/admin').emit('welcome', "Welcome to the Admin Channel!")
})