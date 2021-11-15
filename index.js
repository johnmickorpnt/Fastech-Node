const express = require('express')
const { io } = require("socket.io-client");
const app = express()
var session = require('express-session')
const cookieParser = require("cookie-parser")
var MySQLStore = require('express-mysql-session')(session)
var path = require('path')
app.set("view engine", "ejs")
require("dotenv").config()
require('./session')(app);
const db = require('./db')
var mysql = require('mysql')
var base64 = require('base-64');
app.listen(3000)

const socket = io("http://localhost:8080");

app.set('views', [path.join(__dirname, 'views'), path.join(__dirname, 'views/components/')])
app.set('views', [path.join(__dirname, 'views'), path.join(__dirname, 'views/services/')])

app.use((req, res, next) => {
    // console.log(req.session)
    // console.log(`${req.method} - ${req.url}`)
    next()
});

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//serving public file
app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser())


app.get('/', function(req, res) {
    if (req.session.user) {
        res.render("index", { user: req.session.user })
    } else {
        res.render("index")
    }
})

app.get('/destroy', (req, res, next) => {
    req.session.destroy()
    res.redirect("/")
})


app.get('/services:num', (req, res, next) => {
    res.render(`services/service${req.params.num}`, { user: req.session.user })
})

app.get('/myaccount', async(req, res, next) => {
    if (req.session.user) {
        var data;
        const search = "SELECT * FROM registered_users WHERE email =  ? or username = ?"
        const searchQuery = mysql.format(search, [req.session.user, req.session.user])
        console.log(searchQuery)
        db.getConnection(async(err, connection) => {
            await connection.query(searchQuery, async(err, result) => {
                const retrieve = "SELECT * FROM appointments WHERE requestee = ?"
                if (err) throw (err)
                const requestee = result[0].id
                const retrieveQuery = mysql.format(retrieve, [requestee])
                console.log(requestee)
                console.log(retrieveQuery)
                await connection.query(retrieveQuery, async(err, result) => {
                    if (err) throw (err)
                    if (result.length > 0) {
                        data = result
                    }
                    res.render(`myaccount`, { user: req.session.user, data })
                })
            })
        })
    } else
        res.redirect("/")
})

app.get('/set-an-appointment', (req, res, next) => {
    if (req.session.user)
        res.render("appointments", { user: req.session.user })
    else
        res.redirect('/auth/login')
})

app.get('/register-success', (req, res, next) => {
    if (req.session.user)
        res.redirect('/')
    else
        res.render('registersuccess')
})

app.post('/submit-appointment', async(req, res, next) => {
    const name = req.body.name
    const phone = req.body.phone
    const email = req.body.email
    const address = req.body.address
    const service = req.body.service
    const date = req.body.date
    const time = req.body.time
    const message = req.body.message
    const sqlInsert = "INSERT INTO `appointments` (`apt_id`, `requestee`, `name`, `phone`, `email` , `address`, `service`, `date`, `time`,`issue`, `ticket`, `status`) VALUES (NULL,?,?,?,?,?,?,?,?,?,?,?)"
        // ? will be replaced by values
        // ?? will be replaced by string
    db.getConnection(async(err, connection) => {
        if (err) throw (err)
        const sqlSearch = "SELECT * from registered_users where username = ? or email = ?"
            // const insert_query = mysql.format(sqlInsert, [name, phone, user, email, phone, hashedPassword, datetime])
        const search_query = mysql.format(sqlSearch, [req.session.user, req.session.user])
        console.log(search_query)
        await connection.query(search_query, async(err, result) => {
            // connection.release()
            if (err) throw (err)
            if (result.length > 0) {
                const id = result[0].id
                const ticket = base64.encode(makeString(10));
                console.log(ticket);
                const insert_query = mysql.format(sqlInsert, [id, name, phone, email, address, service, date, time, message, ticket, "pending"])
                await connection.query(insert_query, (err, result) => {
                    // connection.release()
                    if (err) throw (err)
                    console.log("--------> Created new Appointment")
                    console.log(result.insertId)
                    res.redirect('/myaccount')
                })
            }
        })
    })
})

// Session Store Block
var options = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'session_test',
    createDatabaseTable: false,
    schema: {
        tableName: 'custom_sessions_table_name',
        columnNames: {
            session_id: 'custom_session_id',
            expires: 'custom_expires_column_name',
            data: 'custom_data_column_name'
        }
    }
}

var sessionStore = new MySQLStore(options)
    // SESSION STORE END BLOCK 

function makeString(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

const authRouter = require("./routes/auth")
app.use("/auth", authRouter)