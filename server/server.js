// Har Har Mahadev

require('dotenv').config()
const express = require('express')
const app = express()
const chalk = require('chalk');
const boxen = require('boxen');
const cors = require('cors')
const cookieParser = require('cookie-parser')

require('dnscache')({
    "enable":true,
    "ttl":300,           //Time to live (300s =5 min)
    "cachesize":1000     // means can remember upto 1000 diffrent IP addresees
})
app.use(
    cors({
        origin: [process.env.CLIENT_URL || "http://localhost:5173", "http://127.0.0.1:5173"],
        methods: ['GET', 'POST', 'PUT', 'PATCH'],
        credentials: true
    })
)
app.use(cookieParser())
app.use(express.json())


//DB connection
const { connectDB } = require('./database/db')
connectDB()

//routes connection
const { authRouter } = require('./routes/auth.routes')
app.use('/auth', authRouter)

//welcome Route
app.get('/', (req, res) => {
    res.send(`<h1>GuruAI Server is listening...`)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    //step 1: with the help of chalk.green.bold we wrote a message
    const message = chalk.green.bold(`server Started at http://localhost:${PORT}`)

    //step 2: then passed the message and box properties into the box
    const box = boxen(message, {
        padding: 1,
        margin: 1,
        borderStyle: 'double',
        borderColor: 'green',
        textAlignment: 'center'
    })
    // step 3:now printed the box 
    console.log(box);
})
