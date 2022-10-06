var io;
var gameSocket;

var runningGames = [];

const initializeGame = (socketio, socket) => {
    io = socketio;
    gameSocket = socket;

    runningGames.push(gameSocket);

    gameSocket.on("disconnect", handleDisconnect)

    gameSocket.on("move", move);

    
}