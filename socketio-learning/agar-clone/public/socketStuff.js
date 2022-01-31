let socket = io.connect('http://localhost:8080')

// This function is called when the user clicks on the start button

// We'll start with the init() we call when the user is ready to play
function init() {
    // Start drawing on the screen
    draw()
    // Call the init event when the client is ready for the data
    socket.emit('init', {
        playerName: player.name
    })
}
socket.on('initReturn', (data) => {
    console.log('Data on initReturn: ', data)
    orbs = data.orbs
    setInterval(() => {
        socket.emit('tick', {
            xVector: player.xVector,
            yVector: player.yVector,
        })
    }, 33)
})

socket.on('tock', (data) => {
    console.log('Data on tock: ', data)
    players = data.players,
    player.locX = data.playerX,
    player.locY = data.playerY
})

socket.on('orbSwitch', (data) => {
    console.log('orb data: ', data)
    orbs.splice(data.orbIndex, 1, data.newOrb)
})

socket.on('tickTock', (data) => {
    player.locX = data.playerX
    player.locY = data.playerY
})

socket.on('updateLeaderboard', (data) => {
    document.querySelector('.leader-board').innerHTML = ""
    data.forEach((curPlayer) => {
        document.querySelector('.leader-board').innerHTML += `<li class="leaderboard-player>${curPlayer.name} - ${curPlayer.score}</li>`
    })
})

socket.on('playerDeath', (data) => {
    document.querySelector('#game-message').innerHTML = `${data.died.name} absorbed by ${data.killedBy.name}`
    $("#game-message").css({
        "background-color": "00e6e6",
        "opacity": 1
    })
    $("#game-message").show()
    $("#game-message").fadeOut(5000)
})