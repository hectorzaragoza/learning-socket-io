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