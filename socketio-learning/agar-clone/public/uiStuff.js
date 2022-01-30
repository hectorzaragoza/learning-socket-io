// This will handle the DOM Manipulation
// Define dimensions of Canvas (using jQuery)
let wHeight = $(window).height();
let wWidth = $(window).width()
// This is all things "this" player
let player = {}
let orbs = []

let canvas = document.querySelector('#the-canvas')
let context = canvas.getContext('2d')
canvas.width = wWidth
canvas.height = wHeight

$(window).load(() => {
    $('#loginModal').modal('show')
}) 

$('.name-form').submit((event) => {
    event.preventDefault()
    console.log('Submitted')
    player.name = document.querySelector('#name-input').value
    $('#loginModal').modal('hide')
    $('#spawnModal').modal('show')
    document.querySelector('.player-name').innerHTML = player.name
})

$('.start-game').click(() => {
    $('.modal').modal('hide')
    $('.hiddenOnStart').removeAttr('hidden')
    init()
})