// Node will capture local performance data to send to
// socket.io server

// We'll use the modules:
// -- Farmhash - Google module to do hashing algorithms
// -- socket.io-client

// What do we need to know about node about performance?
// CPU Load, Memory Usage, Total Memory, Free Memory
// OS System, Time Online, Processor Info (type, num of cores, clock speed)

// All of this info is available in the os module
const os = require('os')
const { resolve } = require('path')
// socket.io for a node client
const io = require('socket.io-client')
// this line sends a request to our socket.io server that is listening to port 8181
let socket = io('http://localhost:8181')

socket.on('connect', () => {
    console.log('Node connected to the socket.io server! Hurray!')
    // We need a way to identify this machine to whomever is concerned.
    const networkInterface = os.networkInterfaces()
    let macAddress
    // Loop through all network interfaces for this maching and find a non internal one 
    for (let key in networkInterface) {

        // For testing purpose
        macAddress = Math.floor(Math.random()*3) + 1
        break;

        if (!networkInterface[key][0].internal) {
            if (networkInterface[key][0].mac === '00:00:00:00:00:00') {
                macAddress = Math.random().toString(36).substring(2,15)
            } else {
                macAddress = networkInterface[key][0].mac
            }
            break;
        }
    }

    // Authentication - with single key value (random string)
    socket.emit('clientAuth', "23o2k3noidug9338joihah")

    performanceData().then((allPerformanceData) => {
        allPerformanceData.macAddress = macAddress
        socket.emit('initPerfData', allPerformanceData)
    })

    // Sending performance data from client to socket.io server on interval
    let perfDataInterval = setInterval(() => {
        performanceData().then((allPerformanceData) => {
            allPerformanceData.macAddress = macAddress
            socket.emit('perfData', allPerformanceData)
        })
    }, 1000)

    socket.on('disconnect', () => {
        clearInterval(perfDataInterval)
    })
})


function performanceData() {
    return new Promise(async (resolve, reject) => {

        // OS Type and uptime
        const osType = os.type()
        const upTime = os.uptime()

        // Memory Variables
        const freeMem = os.freemem() // in Bytes as an integer
        const totMem = os.totalmem() // Bytes as an integer
        const usedMem = totMem - freeMem
        const memUsage = Math.floor(usedMem/totMem*100)/100

        // CPU Variables
        const cpus = os.cpus()
        const cpuModel = cpus[0].model
        const cpuSpeed = cpus[0].speed
        const numCores = cpus.length

        // Get CPU Load
        const cpuLoad = await getCpuLoad()
        const isActive = true
        resolve({
            freeMem,
            totMem,
            usedMem,
            memUsage,
            osType,
            upTime,
            cpuModel,
            numCores,
            cpuSpeed,
            cpuLoad,
            isActive
        })
    })
}


// CPU Load, we need avg of all cores == cpu avg
function cpuAverage() {
    // We get a snapshot of load so we need to call it to get an update
    // to compare change and get current load data
    const cpus = os.cpus()
    // get ms in each mode, but this num is since reboot
    // get it now then in 100 ms and compare to see 
    // current load
    let idleMs = 0;
    let totalMs = 0;
    // Outer loop is for each core
    cpus.forEach((aCore) => {
        // loop through each property of current core
        for(key in aCore.times) {
            totalMs += aCore.times[key]
        }
        idleMs += aCore.times.idle
    })
    return {
        idle: idleMs/cpus.length,
        total: totalMs/cpus.length
    }  
}

function getCpuLoad() {
    return new Promise((resolve, reject) => {
        const start = cpuAverage()
        setTimeout(() => {
            const end = cpuAverage()
            const idleDifference = end.idle - start.idle
            const totalDifference = end.total - start.total
            // calc the % of cpu used in those 100ms
            const percentageCpu = 100 - Math.floor(100*idleDifference/totalDifference)
            resolve(percentageCpu)
        }, 100)
    })
}

