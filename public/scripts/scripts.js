import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";

const socket = io("ws://localhost:8080");


socket.on("msg-r", (e, bool) => {
    displayMsg(e, bool);
});


$("document").ready(() => {
    $(".chat").slideToggle();
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
    var objDiv = document.getElementById("chat-body");
    objDiv.scrollTop = objDiv.scrollHeight;
}

$("#chatBtn").click(() => {
    $(".chat").slideToggle();
    socket.emit("join", "room1");
});