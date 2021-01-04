const socket = io();

const form = document.querySelector('#sendContainer');
const messageInput = document.querySelector('#messageInp');
const messageContainer = document.querySelector('.container');

const appendElement = (message, position, nm) => {
    if (position === 'left') {
        const messageElement = document.createElement('div');
        messageElement.innerHTML = `<div class="naam">${nm}</div><p>${message}</p></div>`;
        messageElement.classList.add('message');
        messageElement.classList.add(position);
        messageContainer.append(messageElement);
    } else if (position === 'right') {
        const messageElement = document.createElement('div');
        messageElement.innerHTML = `<p>${message}</p>`;
        messageElement.classList.add('message');
        messageElement.classList.add(position);
        messageContainer.append(messageElement);
    } else if (position === 'center') {
        const messageElement = document.createElement('p');
        messageElement.innerHTML = `<p>${message}</p>`;
        messageElement.classList.add(position);
        messageContainer.append(messageElement);
    }
}

let naam = prompt('Enter Your Username: ');
while (!naam) {
    naam = prompt('Username is required!: ');
}

socket.emit('new-user-joined', naam);

socket.on('user-joined', naam => {
    appendElement(`${naam} joined the chat`, 'center', ` `);
});

socket.on('receive', data => {
    appendElement(`${data.message}`, 'left', `${data.name}`)
});

socket.on('left', naam => {
    appendElement(`${naam} left the chat`, 'center', naam)
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    appendElement(`${message}`, 'right', `You`);
    socket.emit('send', message);
    messageInput.value = '';
});