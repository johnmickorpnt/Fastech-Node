const http = require('http').createServer();

const io = require('socket.io')(http, {
    cors: {
        origin: "*"
    }
});

io.on("connection", socket => {
    console.log("connected");
    let roomId = "roomId";
    socket.join("roomId");
    socket.on("msg", (e) => {
        socket.to(roomId).emit("msg-r", e, true);
    });
});



http.listen(8080, () => console.log("listening on port 8080"))