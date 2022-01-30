// Agar.io clone
const express = require('express')
const app = express()
const socketio = require('socket.io')

// Allows: Serve static files (html, css, js)
app.use(express.static(__dirname + '/public'))

const expressServer = app.listen(8080)
const io = socketio(expressServer)

console.log('io Server is running on port 8080')


