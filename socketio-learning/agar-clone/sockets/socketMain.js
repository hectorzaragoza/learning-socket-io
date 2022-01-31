// Where all of our main socket stuff will go
const io = require('../server').io
const checkForOrbCollisions = require('./checkCollisions').checkForOrbCollisions
const checkForPlayerCollisions = require('./checkCollisions').checkForPlayerCollisions

// ========= Classes ===========
const Player = require('./classes/Player')
const PlayerData = require('./classes/PlayerData')
const PlayerConfig = require('./classes/PlayerConfig')
const Orb = require('./classes/Orb')
let orbs = []
let players = []
let settings = {
    defaultOrbs: 5000,
    defaultSpeed: 6,
    defaultSize: 6,
    defaultZoom: 1.5,
    worldWidth: 5000,
    worldHeight: 5000 
}

initGame()

// Issue a message to EVERY connected socket 30 fps
setInterval(() => {
    if(players.length > 0) {
        io.to('game').emit('tock', {
            players
        })
    }
}, 33) // There are 30, 33s in 1000 milliseconds, or 1/30th of a second, or 1 of 30fps


// Our connection between client and server. Io is for our socket.io server
// that takes our express server as input,
// sockets is the alias for the main namespace ('/') which
// is what everyone connects to at the start. 
// on is to register a new handler for the event on 
// the main namespace
io.sockets.on('connect', (socket) => {
    let player = {}
    // A player has connected
    socket.on('init', (data) => {
        // Add the player to the game namespace
        socket.join('game')
        console.log('Data on connection: ', data)
        // Make a playerConfig object (1:1 between server and each client)
        let playerConfig = new PlayerConfig(settings)
        // Make a playerData object (Everyone needs this)
        let playerData = new PlayerData(data.playerName, settings)
        // Make a master player object to hold both
        player = new Player(socket.id, playerConfig, playerData)

        // Issue a message to THIS client connected socket 30 fps
        setInterval(() => {
            socket.emit('tickTock', {
                playerX: player.playerData.locX,
                playerY: player.playerData.locY
            })
        }, 33) // There are 30, 33s in 1000 milliseconds, or 1/30th of a second, or 1 of 30fps

        socket.emit('initReturn', {
            orbs
        })
        players.push(playerData)
    })
    // The client sent over a tick. We now know the direction of the player
    socket.on('tick', (data) => {
        console.log('Data on tick: ', data)
        speed = player.playerConfig.speed

        // Update the playerConfig with the new direction in data
        // and assign to local variable
        xV = player.playerConfig.xVector = data.xVector;
        yV = player.playerConfig.yVector = data.yVector;

        if((player.playerData.locX < 5 && player.playerData.xVector < 0) || (player.playerData.locX > settings.worldWidth) && (xV > 0)){
            player.playerData.locY -= speed * yV;
        }else if((player.playerData.locY < 5 && yV > 0) || (player.playerData.locY > settings.worldHeight) && (yV < 0)){
            player.playerData.locX += speed * xV;
        }else{
            player.playerData.locX += speed * xV;
            player.playerData.locY -= speed * yV;
        }
        let capturedOrb = checkForOrbCollisions(player.playerData, player.playerConfig, orbs, settings)
        capturedOrb.then((data) => {
            // then runs if resolve runs, i.e. collision happened
            // data is giving us the index
            // emit to all sockets the orb to replace
            const orbData = {
                orbIndex: data,
                newOrb: orbs[data]
            }
            // console.log(orbData)
            io.sockets.emit('updateLeaderboard', getLeaderboard())
            io.sockets.emit('orbSwitch', orbData)
        }).catch(() => {
            
        })
        // Player Collision
        let playerDeath = checkForPlayerCollisions(player.playerData, player.playerConfig, players, player.socketId)
        playerDeath.then((data) => {
            console.log('Player collision')
            io.sockets.emit('updateLeaderboard', getLeaderboard())
            // A player was absorbed, let all know
            io.sockets.emit('playerDeath', data)
        }).catch(() => {
            // No player Collision
        })  
    })
    socket.on('disconnect', (data) => {
        //find out who just left
        // which player in players
        if(player.playerData) {
            players.forEach((curPlayer, i) => {
                if(curPlayer.uid == player.playerData.uid) {
                    players.splice(i, 1)
                    io.sockets.emit('updateLeaderboard', getLeaderboard())
                }
            })
        }
    })
})

function getLeaderboard() {
    // Sort players in descending order
    players.sort((a, b) => {
        return b.score - a.score;
    })
    let leaderboard = players.map((curPlayer) => {
        return {
            name: curPlayer.name,
            score: curPlayer.score
        }
    })
    return leaderboard
}

// Run at beginning of new game
function initGame() {
    for(let i = 0; i < settings.defaultOrbs; i++) {
        orbs.push(new Orb(settings))
    }
}


module.exports = io