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
            cpuLoad
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

performanceData().then((allPerformanceData) => {
    console.log('All Data: ', allPerformanceData)
})