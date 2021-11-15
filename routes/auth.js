const express = require("express")
const router = express.Router()
var mysql = require('mysql')
const bcrypt = require("bcrypt")
var session = require('express-session')
var MySQLStore = require('express-mysql-session')(session)
require("dotenv").config()
router.use(express.json())
require('../session')(router);
const db = require('../db')


router.get('/login', (req, res, next) => {
    res.render("auth/login")
})

router.post('/login', (req, res, next) => {
    const username = req.body.username
    connection.query('SELECT * from registered_users', function(error, results, fields) {
        console.log(JSON.parse(JSON.stringify(results)))
    })
    res.redirect("/")
})

router.post('/login-submit', (req, res, next) => {
    const user = req.body.email
    const password = req.body.password
    db.getConnection(async(err, connection) => {
        if (err) throw (err)
        const sqlSearch = "SELECT * from registered_users where username = ? or email = ?"
        const search_query = mysql.format(sqlSearch, [user, user])
        console.log(search_query)
        await connection.query(search_query, async(err, result) => {
            // connection.release()
            if (err) throw (err)
            if (result.length == 0) {
                console.log("--------> User does not exist")
                res.redirect("/auth/register")
            } else {
                const hashedPassword = result[0].password
                if (await bcrypt.compare(password, hashedPassword)) {
                    console.log("---------> Login Successful")
                    req.session.user = user
                    res.redirect("/")
                } else {
                    console.log("---------> Password Incorrect")
                    let msg = "error=103"
                    res.redirect("/auth/login" + msg)
                } //end of bcrypt.compare()
            }
        })
    })
})

router.get('/register', (req, res, next) => {
    res.render('auth/register', { msg: "" })
    next()
})

router.post('/register', async(req, res, next) => {
    // console.log(req.body)
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const user = req.body.username
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const email = req.body.email
    const phonenumber = req.body.phonenumber
    var currentdate = new Date()
    var datetime = currentdate.getDate() + "/" +
        (currentdate.getMonth() + 1) + "/" +
        currentdate.getFullYear() + " @ " +
        currentdate.getHours() + ":" +
        currentdate.getMinutes() + ":" +
        currentdate.getSeconds()
    console.log(datetime)

    db.getConnection(async(err, connection) => {
        if (err) throw (err)
        const sqlSearch = "SELECT * FROM registered_users WHERE username = ? or email = ?"
        const search_query = mysql.format(sqlSearch, [user, email])
        const sqlInsert = "INSERT INTO `registered_users` (`id`, `first_name`, `last_name`, `username`, `email` , `phonenumber`, `password`, `remember_token`, `created_at`) VALUES (NULL,?,?,?,?,?,?,NULL,?)"
        const insert_query = mysql.format(sqlInsert, [firstName, lastName, user, email, phonenumber, hashedPassword, datetime])
            // ? will be replaced by values
            // ?? will be replaced by string
        await connection.query(search_query, async(error, results, fields) => {
            if (error) throw error
            console.log("------> Search Results")
            console.log(results.length)
            if (results.length != 0) {
                connection.release()
                console.log("------> User already exists")
                let msg = "/error=101"
                res.redirect('/auth/register' + msg)
            } else {
                console.log(insert_query)
                await connection.query(insert_query, (err, result) => {
                    connection.release()
                    if (err) throw (err)
                    console.log("--------> Created new User")
                    console.log(result.insertId)
                    res.redirect('/')
                })
            }
        })
    })
})

router.get('/register/:error', (req, res, next) => {
    let error = (req.params.error.includes("101")) ? ("User Exists") : ("Unknown Error")
    res.render("auth/register", { msg: error })
})

router.post('/register/:error', async(req, res, next) => {
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const user = req.body.username
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const email = req.body.email
    var currentdate = new Date()
    var datetime = currentdate.getDate() + "/" +
        (currentdate.getMonth() + 1) + "/" +
        currentdate.getFullYear() + " @ " +
        currentdate.getHours() + ":" +
        currentdate.getMinutes() + ":" +
        currentdate.getSeconds()
    console.log(datetime)
    db.getConnection(async(err, connection) => {
        if (err) throw (err)
        const sqlSearch = "SELECT * FROM registered_users WHERE username = ? or email = ?"
        const search_query = mysql.format(sqlSearch, [user, email])
        const sqlInsert = "INSERT INTO `users` (`id`, `first_name`, `last_name`, `username`, `email`, `password`, `remember_token`, `created_at`) VALUES (NULL,?,?,?,?,?,NULL,?)"
        const insert_query = mysql.format(sqlInsert, [firstName, lastName, user, email, hashedPassword, datetime])
            // ? will be replaced by values
            // ?? will be replaced by string
        await connection.query(search_query, async(error, results, fields) => {
            if (error) throw error
            console.log("------> Search Results")
            console.log(results.length)
            if (results.length != 0) {
                connection.release()
                console.log("------> User already exists")
                let msg = "/error=101"
                res.redirect('/auth/register' + msg)
            } else {
                console.log(insert_query)
                await connection.query(insert_query, (err, result) => {
                    connection.release()
                    if (err) throw (err)
                    console.log("--------> Created new User")
                    console.log(result.insertId)
                    res.redirect('/auth/login')
                })
            }
        })
    })
})

router.get('/logout', (req, res, next) => {
    req.session.destroy()
    res.redirect("/")
})

router.get('/', (req, res, next) => {
    res.redirect("/")
})

module.exports = router