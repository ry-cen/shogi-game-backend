var io;
var gameSocket;

var runningGames = new Map();
var openSockets = new Map();

const initializeGame = (socketio, socket) => {
    io = socketio;
    gameSocket = socket;

    gameSocket.on("createGame", createGame);

    gameSocket.on("joinGame", joinGame);

    gameSocket.on("move", newMove);

    gameSocket.on("send username", setUsername);

    gameSocket.on("request username", getUsername);

    gameSocket.on("disconnect", onDisconnect);

    
}

function onDisconnect() {
    var socket = this;
    const gameId = openSockets[socket.id]
    if (runningGames[gameId] !== undefined) {
        delete runningGames[gameId];
    }

    io.to(gameId).emit("opponent disconnect");
    delete openSockets[socket.id];
    
}

function newMove(move) {
    var socket = this

    const gameId = move.gameId
    socket.to(gameId).emit('opponent move', move);
}

function createGame(gameId) {

    console.log(this.id + " created a new game with id " + gameId)

    runningGames[gameId] = new Map();

    openSockets[this.id] = gameId
    this.join(gameId)
}

function joinGame(gameId) {
    var socket = this
    

    if (io.sockets.adapter.rooms.get(gameId) === undefined || runningGames[gameId] === undefined) {
        socket.emit("does not exist")
        return

    } else if (io.sockets.adapter.rooms.get(gameId).size <= 1) {

        openSockets[socket.id] = gameId
        socket.join(gameId)

        socket.emit("joined")

        if (io.sockets.adapter.rooms.get(gameId).size === 2) {

            io.to(gameId).emit("both players ready")
        }

        console.log(socket.id + " joined game with id " + gameId)

    } else if (io.sockets.adapter.rooms.get(gameId).size >= 2) {

        socket.emit("does not exist")
    }

}

function setUsername(data) {
    let username = data.username;
    let color = data.color;
    let gameId = data.gameId;

    if (runningGames[gameId] !== undefined) {
        runningGames[gameId][color] = username
    }

    
}

function getUsername(data) {
    var socket = this
    let color = data.color;
    let gameId = data.gameId;

    
    const username = runningGames[gameId][color]

    socket.emit("opponent username", {
        username: username
    })
}

exports.initializeGame = initializeGame