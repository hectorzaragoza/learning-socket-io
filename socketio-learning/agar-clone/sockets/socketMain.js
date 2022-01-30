// Where all of our main socket stuff will go
const io = require('../server').io

// ========= Classes ===========
const Player = require('./classes/Player')
const PlayerData = require('./classes/PlayerData')
const PlayerConfig = require('./classes/PlayerConfig')
const Orb = require('./classes/Orb')
let orbs = []
let players = []
let settings = {
    defaultOrbs: 500,
    defaultSpeed: 6,
    defaultSize: 6,
    defaultZoom: 1.5,
    worldWidth: 500,
    worldHeight: 500 
}

initGame()

// Issue a message to EVERY connected socket 30 fps
setInterval(() => {
    io.to('game').emit('tock', {
        players
    })
}, 33) // There are 30, 33s in 1000 milliseconds, or 1/30th of a second, or 1 of 30fps

// Our connection between client and server. Io is for our socket.io server
// that takes our express server as input,
// sockets is the alias for the main namespace ('/') which
// is what everyone connects to at the start. 
// on is to register a new handler for the event on 
// the main namespace
io.sockets.on('connect', (socket) => {
    // A player has connected
    socket.on('init', (data) => {
        // Add the player to the game namespace
        socket.join('game')
        // Make a playerConfig object (1:1 between server and each client)
        let playerConfig = new PlayerConfig(settings)
        // Make a playerData object (Everyone needs this)
        let playerData = new PlayerData(data.playerName, settings)
        // Make a master player object to hold both
        let player = new Player(socket.id, playerConfig, playerData)
        socket.emit('initReturn', {
            orbs
        })
        players.push(playerData)
    })
})

// Run at beginning of new game
function initGame() {
    for(let i = 0; i < settings.defaultOrbs; i++) {
        orbs.push(new Orb(settings))
    }
}


module.exports = io