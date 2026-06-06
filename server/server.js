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

// CORS configuration — strengthened for Production
const allowedOrigins = [
    process.env.CLIENT_URL,
    "https://guruaiplatform.vercel.app",
    "https://guruaivercel.vercel.app",
    "https://guruaii.netlify.app",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:5176"
].map(url => url?.replace(/\/$/, "")); // Remove trailing slashes for perfect matching

app.use(cors({
    origin: function (origin, callback) {
        // Allow local requests or requests from allowed origins
        if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ""))) {
            callback(null, true);
        } else {
            console.log("CORS Blocked Origin:", origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));


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

//widget integration route connection
const { widgetRouter } = require('./routes/widget.routes')
app.use('/widget', widgetRouter)

//welcome Route
app.get('/', (req, res) => {
    res.send(`<h1>GuruAI Server is running properly...</h1><p>Status: Healthy</p>`)
})

if (require.main === module) {
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
}

module.exports = app;


