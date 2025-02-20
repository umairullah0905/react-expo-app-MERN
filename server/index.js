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

// MongoDB Connection
// mongoose.connect(process.env.MONGO, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });

// User Schema
// const userSchema = new mongoose.Schema({
//     username: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     role: { type: String, enum: ["user", "admin"], default: "user" },
// });

// userSchema.pre("save", async function (next) {
//     if (this.isModified("password")) {
//         this.password = await bcrypt.hash(this.password, 10);
//     }
//     next();
// });

// const User = mongoose.model("User", userSchema);

// Middleware to Verify Token and Role
// const authenticate = (roles) => (req, res, next) => {
//     const token = req.headers.authorization?.split(" ")[1];
//     if (!token) return res.status(401).json({ message: "Unauthorized" });

//     try {
//         const decoded = jwt.verify(token, "secretKey");
//         req.user = decoded;

//         if (roles && !roles.includes(req.user.role)) {
//             return res.status(403).json({ message: "Forbidden" });
//         }

//         next();
//     } catch (err) {
//         res.status(401).json({ message: "Invalid Token" });
//     }
// };

// Routes
// app.post("/register", async (req, res) => {
//     const { username, password, role } = req.body;
//     const user = new User({ username, password, role });
//     await user.save();
//     res.status(201).json({ message: "User Registered" });
// });

// app.post("/login", async (req, res) => {
//     const { username, password } = req.body;
//     const user = await User.findOne({ username });

//     // If user is not found or password is incorrect, return an error
//     if (!user || !(await bcrypt.compare(password, user.password))) {
//         return res.status(400).json({ message: "Invalid Credentials" });
//     }

//     // Generate the token with user data (id, role)
//     const token = jwt.sign({ id: user._id, role: user.role }, "secretKey", {
//         expiresIn: "1h",
//     });

//     // Send the token, id, and role in the response
//     res.json({
//         token,     // The JWT token
//         id: user._id, // User ID
//         role: user.role, // User role (admin/user)
//     });
// });

// app.get("/admin", authenticate(["admin"]), (req, res) => {
//     res.json({ message: "Welcome Admin!" });
// });

// app.get("/user", authenticate(["user", "admin"]), (req, res) => {
//     res.json({ message: "Welcome User!" });
// });




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
