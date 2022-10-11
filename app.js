const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const gameManager = require('./game-manager')
const app = express()

const server = http.createServer(app)

const io = socketio(server, {
    cors:{
        origin: '*'
    }
})

io.on('connection', client => {
    gameManager.initializeGame(io, client)
})

server.listen(8000, () => {
    console.log(`Server running`);
})