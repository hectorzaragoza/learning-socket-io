const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1/perfData', {useNewUrlParser: true})
const Machine = require('./models/Machine')

function socketMain(io, socket) {
    let macAddress;
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
    socket.on('initPerfData', async (data) => {
        // Update our function scoped variable for mac address
        console.log('This is initperfdata: ', data)
        macAddress = data.macAddress
        const mongooseResponse = await checkAndAdd(data)
        console.log('Mongoose Response: ', mongooseResponse)
    })


    socket.on('perfData', (data) => {
        console.log('This is the performance data from the client (1sec): ', data)
    })
}

function checkAndAdd(data) {
    // Because we are doing db stuff, js wont wait, so use a promise
    return new Promise((resolve, reject) => {
        Machine.findOne(
            {macAddress: data.macAddress},
            (err, doc) => {
                if(err) {
                    throw err
                } else if (doc === null) {
                    // not in db, add it
                    let newMachine = new Machine(data)
                    newMachine.save()
                    resolve('added')
                } else {
                    resolve('found')
                }
            }
        )
    })
}

module.exports = socketMain