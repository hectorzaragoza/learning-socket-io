const socket = io('http://localhost:9000') // the '/' namespace
const socket2 = io('http://localhost:9000/admin') // the /admin namespace
// const socket3 = io('http://localhost:9000/marketing') // the /marketing namespace

//There is no cross socket communication

socket.on('connect', () => {
    console.log(socket.id)
})
// Connecting to second namespace
socket2.on('connect', () => {
    console.log(socket2.id)
})

socket2.on('welcome', (msg) => {
    console.log(msg)
})

socket.on('messageFromServer', (dataFromServer) => {
    console.log(dataFromServer)
    socket.emit('messageToServer', {data: "This is from the client"})
})

document.querySelector('#message-form').addEventListener('submit', (event) => {
    event.preventDefault()
    console.log("Form Submitted!")
    const newMessage = document.querySelector('#user-message').value
    socket.emit('newMessageToServer', {text: newMessage})
})

socket.on('messageToClients', (msg) => {
    console.log(msg.text)
    document.querySelector('#messages').innerHTML += `<li>${msg.text}</li>`
})