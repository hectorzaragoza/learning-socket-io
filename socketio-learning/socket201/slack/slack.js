const express = require('express')
const app = express();
const socketio = require('socket.io');

let namespaces = require('./data/namespaces');
console.log('These are my namespaces: ', namespaces)
// Middleware to serve static files from public folder
app.use(express.static(__dirname + '/public'))
// Express setup
const expressServer = app.listen(9000)
// Hand Express server to socketio Server
const io = socketio(expressServer)

// .on is assuming main namespace... io.on === io.of('/').on
// You can use .of to specify a particular namespace

io.on('connection', (socket) => {
    console.log(socket.handshake)
   // Build an array to send back with an img and enpoint per namespace
    let nsData = namespaces.map((ns) => {
        return {
            img: ns.img,
            endpoint: ns.endpoint
        }
    })
    // console.log('nsData: ', nsData)
    // Send the nsData back to the client. We need to use socket,
    // NOT io, because we want it to go to just this client.
    socket.emit('nsList', nsData);
})

// Loop through each namespace and listen for a connection
namespaces.forEach((namespace) => {
    io.of(namespace.endpoint).on('connection', (nsSocket) => {
        const username = nsSocket.handshake.query.username
        // console.log(`${nsSocket.id} has joined ${namespace.endpoint}`)
        // A socket has connected to one of our chat room namespaces
        // Send that namespaces group info back
        nsSocket.emit('nsRoomLoad', namespace.rooms)
        nsSocket.on('joinRoom', (roomToJoin, numberOfUsersCallback) => {
            // Deal with history once we have it
            const roomToLeave = Object.keys(nsSocket.rooms)[1]
            nsSocket.leave(roomToLeave)
            updateUsersInRoom(namespace, roomToLeave)
            nsSocket.join(roomToJoin)
            // io.of('/wiki').in(roomToJoin).clients((error, clients) => {
            //     console.log('Clients', clients.length)
            //     numberOfUsersCallback(clients.length)
            // })
            const nsRoom = namespace.rooms.find((room) => {
                return room.roomTitle === roomToJoin
            })
            nsSocket.emit('historyCatchUp', nsRoom.history)
            // Send back the number of users in this room to all
            // sockets connected in this room.
            updateUsersInRoom(namespace, roomToJoin)
        })
        nsSocket.on('newMessageToServer', (msg) => {
            const fullMsg = {
                text: msg.text,
                time: Date.now(),
                username: username,
                avatar: "https://via.placeholder.com/30"
            }
            // console.log(fullMsg)
            // Send this message to all sockets in the room that
            // This socket is in. How can we find rooms this socket is in?
            // console.log(nsSocket.rooms)
            // The user will always be in the 2nd room in the object list
            // This is because the socket ALWAYS joins its own room on connection
            const roomTitle = Object.keys(nsSocket.rooms)[1]
            // console.log('Room TItle: ', roomTitle)
            // We need to find the Room object for this room
            const nsRoom = namespace.rooms.find((room) => {
                return room.roomTitle === roomTitle
            })
            // console.log('nsRoom', nsRoom)
            nsRoom.addMessage(fullMsg)
            // console.log(nsRoom)
            io.of(namespace.endpoint).to(roomTitle).emit('messageToClients', fullMsg)
        })
    })
})

function updateUsersInRoom(namespace, roomToJoin) {
    io.of(namespace.endpoint).in(roomToJoin).clients((error, clients) => {
        // console.log('there are #: ', clients.length)
        io.of(namespace.endpoint).in(roomToJoin).emit('updateMembers', clients.length)
    })
}