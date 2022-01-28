// Need http because we are not using Express, otherwise use Express
const http = require('http')
//npm i socketio and require it in your node project (npm init)
const socketio = require('socket.io')

//Make a node http server
const server = http.createServer((req, res) => {
    res.end('I am connected')
})

// Initializing a socketio server that takes the node http server
const io = socketio(server, {
    cors: {
        origin: '*'
    }
});

//socket.io
io.on('connect', (socket, req) => {
    // we send method becomes socket emit method
    socket.emit('Welcome to the websocket server!')
    socket.on('message', (msg) => {
        console.log(msg)
    })
})

// Listen to port 8000
server.listen(8000)