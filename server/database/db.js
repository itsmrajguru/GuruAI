require('dotenv').config()
const mongoose=require('mongoose')

//creating a database
const connectDB=async(req,res)=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Database connected successfully')
    } catch (e) {
      console.log(`[Database Error]:${e.message}`);
      process.exit(1)
    }
}
module.exports={connectDB}