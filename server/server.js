//Har Har Mahadev

require('dotenv').config()
const express=require('express')
const app=express()

//connecting DB
const{connectDB}=require('./database/db')
connectDB()

//welcome Route
app.get('/',(req,res)=>{
    res.send('<h1><i>GuruAI-server Started...</i></h1>')
})
const PORT=process.env.PORT
app.listen(PORT,()=>{
    console.log(`GuruAI-Server Started at http://localhost:${PORT}`);
})
