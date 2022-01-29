const socket = io('http://localhost:9000') // the '/' namespace
let nsSocket = ""

// Listen for nsList, which is a list of all namespaces
socket.on('nsList', (nsData) => {
    let namespacesDiv = document.querySelector('.namespaces')
    namespacesDiv.innerHTML = "";
    nsData.forEach((ns) => {
        namespacesDiv.innerHTML += `<div class="namespace" ns=${ns.endpoint}><img src="${ns.img}"/></div>`
    })
    // Add a click listener to each namespace
    Array.from(document.getElementsByClassName('namespace')).forEach((elem) => {
        elem.addEventListener('click', (e) => {
            const nsEndpoint = elem.getAttribute('ns');
            console.log('I should go here: ', nsEndpoint)
        })
    })
    joinNs('/wiki')
})


