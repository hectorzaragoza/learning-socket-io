// React app needs socket.io-client
import io from 'socket.io-client'
// socket now is our connection based on 8181
let socket = io.connect('http://localhost:8181', {transports: ['websocket', 'polling']})
socket.emit('clientAuth', 'i2ih3ihjiu2n9837')
export default socket