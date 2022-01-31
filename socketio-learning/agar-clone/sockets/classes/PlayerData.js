// Data for Everyone

// Use uuid module to create a safe massive random string for the player
const uuidv4 = require('uuid')

class PlayerData {
    constructor(playerName, settings) {
        this.uid = uuidv4() // This will generate a unique id for this player
        this.name = playerName
        this.locX = Math.floor(settings.worldWidth*Math.random()+100)
        this.locY = Math.floor(settings.worldHeight*Math.random()+100)
        this.radius = settings.defaultSize;
        this.color = this.getRandomColor()
        this.score = 0   
        this.obsAbsorbed = 0
    }

    getRandomColor() {
        const r = Math.floor((Math.random() * 200) +50)
        const g = Math.floor((Math.random() * 200) +50)
        const b = Math.floor((Math.random() * 200) +50)
        return `rgb(${r},${g},${b})`
    }
}

module.exports = PlayerData