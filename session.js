// load and initialize session stuff
const session = require('express-session')
const store = new session.MemoryStore()

module.exports = function(app) {
    // install session middleware
    app.use(session({
        secret: "secret-key",
        resave: false,
        saveUninitialized: false,
        store
    }))
}