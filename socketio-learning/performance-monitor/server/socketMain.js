const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:perfData', {useNewUrlParser: true})
const Machine = require('./models/Machine')

function socketMain(io, socket) {
    
    socket.on('clientAutho', (key) => {
        if (key === '23o2k3noidug9338joihah') {
            // Valid nodeClient
            socket.join('clients')
        } else if(key = 'i2ih3ihjiu2n9837') {
            // Valid UI client has joined
            socket.join('ui')
        } else {
            // An invalid client has joined
            socket.disconnect(true)
        }
    })
    
    // A machine has connected, check to see if its new, if so, add it!

    socket.on('perfData', (data) => {
        console.log('This is the performance data from the client (1sec): ', data)
    })
}

module.exports = socketMain