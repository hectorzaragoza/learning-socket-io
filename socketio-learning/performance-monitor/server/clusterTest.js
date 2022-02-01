// Cluster module is awesome. It allows us to take advantage of multi-core cpus to 
// distribute the load of a cluster (many NodeJs instances) across
// workers (a thread, two threads per core) so they can all run
// concurrently.

const cluster = require('cluster')
const http = require('http')


const numCPUs = require('os').cpus().length;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');
  }).listen(8000);

  console.log(`Worker ${process.pid} started on port 8000`);
}