const express = require('express')
const { io } = require("socket.io-client");
const app = express()
var session = require('express-session')
var path = require('path')
require("dotenv").config()
app.set("view engine", "ejs")
app.listen(3001)

const socket = io("http://localhost:8080");

app.set('views', [path.join(__dirname, 'views'), path.join(__dirname, 'views/components/')])
app.set('views', [path.join(__dirname, 'views'), path.join(__dirname, 'views/services/')])

app.use(express.static(path.join(__dirname, 'public')))


app.get("/", (req, res, next) => {
    res.render("index")
});