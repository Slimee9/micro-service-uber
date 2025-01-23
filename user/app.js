const express  = require ('express');
const dotenv = require('dotenv')
dotenv.config()
const app = express()
const userRouters = require('./routes/user.routes')
const cookieParser = require('cookie-parser')
const connect = require('./db/db')
connect()

app.use('/', userRouters)

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())


module.exports = app;