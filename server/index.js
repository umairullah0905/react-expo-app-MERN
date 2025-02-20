const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv")
const authRoutes = require("./routes/auth.js")
const examcontentroutes = require("./routes/examroute.js")
const examdataroutes = require("./routes/examdata.js")




const app = express();
// app.use(express.json());
const cors = require('cors');
app.use(cors());

dotenv.config()

const connect = async()=>{
    try{
        await mongoose.connect(process.env.MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("connected to mongodb")
    }catch(error){
        throw error
    }
    };
    
    mongoose.connection.on("disconnected",()=>{
        console.log("mongoose disconnected")
    })


// app.use(cookieParser())
app.use(express.json())
app.use("/api/auth", authRoutes)
app.use("/api",examcontentroutes)
app.use("/data", examdataroutes)
app.use("/data", examdataroutes)


app.use((err,req,res,next)=>{
    const status = err.status || 500
    const message = err.message || "something went wrong";
    return res.status(status).json({
        success:false,
        status,
        message
    })

})


app.listen(8080,()=>{
    connect()
    console.log("connected to backend")
})
