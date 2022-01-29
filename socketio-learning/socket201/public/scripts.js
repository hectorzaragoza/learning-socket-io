const socket = io('http://localhost:9000') // the '/' namespace
const socket2 = io('http://localhost:9000/admin') // the /admin namespace
// const socket3 = io('http://localhost:9000/marketing') // the /marketing namespace

//There is no cross socket communication
socket.on('messageFromServer', (dataFromServer) => {
    console.log(dataFromServer)
    socket.emit('messageToServer', {data: "This is from the client"})
})

socket.on('joined', (msg) => {
    console.log(msg)
})

socket2.on('welcome', (dataFromServer) => {
    console.log(dataFromServer)
})

document.querySelector('#message-form').addEventListener('submit', (event) => {
    event.preventDefault()
    console.log("Form Submitted!")
    const newMessage = document.querySelector('#user-message').value
    socket.emit('newMessageToServer', {text: newMessage})
})

