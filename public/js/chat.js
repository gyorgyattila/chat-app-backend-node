const socket = io()

const $button = document.querySelector('#chatinputButton')

socket.on('message', (message) => {
    console.log(message)
})

socket.on('sendMessage', (message) => {
    console.log(message)
})

/* socket.on('countUpdated', (count) => {
    console.log('The count updatetd', count)
})
*/
$button.addEventListener('click', ()=>{

    $button.setAttribute('disabled', 'disabled')
    console.log('clicked')
    socket.emit('textmessage', document.getElementById("textMessage").value, ()=>{
        $button.removeAttribute('disabled')
        console.log('The message was delivered', document.getElementById("textMessage").value)
    })
})

document.querySelector('#sendLocation').addEventListener('click', ()=>{
    if (!navigator.geolocation){
        return alert('geolocation is not supported in your browser')
    }

    navigator.geolocation.getCurrentPosition((position) => {
        console.log(position)
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, ()=>{
            console.log('Location Shared')
        })
    })
})