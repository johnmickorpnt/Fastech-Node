import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";

const socket = io("ws://localhost:8080");

socket.on("message", text => {
    console.log(text);

});

socket.on("connect", e => {
    socket.emit("join", "room1");
});

socket.on("msg-r", (e, bool) => {
    displayMsg(e, bool);
});


$("#chat-submit").submit(e => {
    e.preventDefault();
    let msg = $("#chatMainInput").val();
    socket.emit("msg", msg);
    displayMsg(msg, false);
});

function displayMsg(e, isReceiver) {
    // console.log(e);
    let chatClass = (isReceiver) ? ("chat-sender") : ("chat-receiver");
    console.log(`${e} and ${isReceiver}`);
    $(".chat-body").append(`
        <div class="row">
            <div class="col-12 ${chatClass}">
            <p>
                ${e}
            </p>
            </div>
        </div>`);
    $("#chatMainInput").val("");
}