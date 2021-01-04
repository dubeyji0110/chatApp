const express = require('express');
const path = require('path')
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname,'public')));

app.get('/', (req, res) => {
    res.render('index');
});

const users = {};

io.on('connection', socket => {
    console.log('Server Started!');

    socket.on('new-user-joined', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    });

    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
});

http.listen(3000, () => {
    console.log('listening on port 3000');
});