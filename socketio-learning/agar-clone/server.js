// Agar.io clone
const express = require('express')
const app = express()
const socketio = require('socket.io')
// Allows: Serve static files (html, css, js)
app.use(express.static(__dirname + '/public'))
// Feed express server to socketio, to create socket io server
const expressServer = app.listen(8080)
const io = socketio(expressServer)
const helmet = require('helmet')
app.use(helmet())

// App Organization
// Because the socket io messaging transfers can become very long
// I am going to separate my files. server.js is simply going to 
// be for setting up my servers.

// export app and io
module.exports = {
    app,
    io
}
