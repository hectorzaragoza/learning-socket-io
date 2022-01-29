const express = require('express')
const app = express();
const socketio = require('socket.io');
const { isRegExp } = require('util/types');


app.use(express.static(__dirname + '/public'))

// Express setup
const expressServer = app.listen(9000)

const io = socketio(expressServer)

// .on is assuming main namespace... io.on === io.of('/').on
// You can use .of to specify a particular namespace

io.on('connection', (socket) => {
    socket.emit('messageFromServer', {data: 'Welcome to the socketio server'})
    socket.on('messageToServer', (dataFromClient) => {
        console.log(dataFromClient)
    })
    socket.on('newMessageToServer', (msg) => {
        // console.log('Am I getting the message: ', msg)
        io.emit('messageToClients', {text: msg.text})
        // Following line is the same as line above
        io.of('/').emit('messageToClients', {text: msg.text})
    })
    /* The server can still communicate across namespaces but on the clientInformation, the socket needs to be in THAT
    namespace in order to get the events
    */

    // dont use setTimout to try and work around async issues.
    setTimeout(() => {
        io.of('admin').emit('welcome', "Welcome to the admin channel from the main channel")
    }, 2000)
})

io.of('/admin').on('connection', (socket) => {
    console.log('Someone connected to the Admin Namespace!')
    io.of('/admin').emit('welcome', "Welcome to the Admin Channel!")
})