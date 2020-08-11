const socket = io('/')
const messageContainer = document.getElementById('message-container')
const roomContainer = document.getElementById('room-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')


const videoGrid = document.getElementById('video-grid')
const myVideo = document.createElement('video')
myVideo.muted = true
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
})
  .then(stream => {
    addVideoStream(myVideo, stream)
    socket.on('user-joined-call', name => {
      connectUserToVideoChat(name, stream)
    })
  })
  .catch(err => {
    console.log(err);
  })

// todo use exec for displaying existing massages

if (messageForm != null) {
  appendMessage('You joined')
  socket.emit('new-user', roomName, userName)

  messageForm.addEventListener('submit', e => {
    e.preventDefault()
    const message = messageInput.value;
    appendMessage(`You: ${message}`)
    socket.emit('send-chat-message', roomName, message, userName)
    messageInput.value = ''
  })
}

function callButton() {
  console.log('clicked');
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `http://localhost:5000/chat/${roomName}/call`, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onload = function() {
    location.replace(xhr.responseURL);
  }
  xhr.send()
}


socket.on('room-created', room => {
  const roomElement = document.createElement('div')
  roomElement.innerText = room
  const roomLink = document.createElement('a')
  roomLink.href = `/chat/${room}`
  roomLink.innerText = 'join'
  roomContainer.append(roomElement)
  roomContainer.append(roomLink)
})

socket.on('chat-message', (message, name) => {
  console.log('data', name);
  
  appendMessage(`${name}: ${message}`)
})

socket.emit('join-call', roomName, userName)

socket.on('user-connected', name => {
  appendMessage(`${name} connected`)
})

socket.on('user-disconnected', name => {
  appendMessage(`${name} disconnected`)
})

function appendMessage(message) {
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messageContainer.append(messageElement)
}

function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
}