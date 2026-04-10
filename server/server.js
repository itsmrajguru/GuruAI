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

// CORS configuration - allowing production and local URLs
const allowedOrigins = [
    process.env.CLIENT_URL,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://guruaii.netlify.app" // Your official Netlify URL
].filter(Boolean);


app.use(
    cors({
        origin: function (origin, callback) {
            // allow requests with no origin (like mobile apps or curl requests)
            if (!origin) return callback(null, true);
            if (allowedOrigins.indexOf(origin) === -1) {
                var msg = 'The CORS policy for this site does not ' +
                    'allow access from the specified Origin.';
                return callback(new Error(msg), false);
            }
            return callback(null, true);
        },
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        credentials: true
    })
)

app.use(cookieParser())
app.use(express.json())


//DB connection
const { connectDB } = require('./database/db')
connectDB()

// auth routes connection
const { authRouter } = require('./routes/auth.routes')
app.use('/auth', authRouter)

//ai integration routes connection
const { aiRouter } = require('./routes/ai.routes')
app.use('/ai', aiRouter)

//welcome Route
app.get('/', (req, res) => {
    res.send(`<h1>GuruAI Server is running properly...</h1><p>Status: Healthy</p>`)
})

const PORT = process.env.PORT || 2501
app.listen(PORT, '0.0.0.0', () => {
    //step 1: with the help of chalk.green.bold we wrote a message
    const message = chalk.green.bold(`GuruAI Server Started at port ${PORT}`)

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


