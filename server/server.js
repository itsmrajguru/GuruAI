// //Har Har Mahadev

// Har Har Mahadev

require('dotenv').config()
const express = require('express')
const app = express()




//DB connection
const {connectDB}=require('./database/db')
const { connect } = require('mongoose')
connectDB()

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
    // console.lolg(`server listening at http://localhost:${PORT}`)
})




// require('dotenv').config()
// const express = require('express')
// const app = express()
// const cors = require('cors')
// const cookieParser = require('cookie-parser')
// const chalk = require('chalk');
// const boxen = require('boxen');

// /* dnscache is a short-term memory for the server.
// It remembers the IP address of external systems (like MongoDB Atlas),
// so the server does not need to look up the IP address on every request.
// This reduces unnecessary delay and improves performance under high traffic.
// The IP is remembered for 300 seconds (5 minutes), after which it looks up again.*/

// require('dnscache')({
//     "enable": true,
//     "ttl": 300, //time to live -> 300sec =>5 min
//     "cachesize": 1000  //means can remember to upto 1000 diffrent IP addresss
// });

// app.use(
//     cors({
//         origin: [process.env.CLIENT_URL || "http://localhost:5173", "http://127.0.0.1:5173"],
//         methods: ['GET', 'POST', 'PUT', 'PATCH'],
//         credentials: true
//     })
// )
// app.use(cookieParser())
// app.use(express.json())



// //routes
// const { authRouter } = require('./routes/auth.routes')

// app.use('/api/auth', authRouter)


