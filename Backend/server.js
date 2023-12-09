const express = require("express"); 
const cors = require("cors"); 
const mongoose = require("mongoose"); 

require("dotenv").config(); 

//create express server
const app = express(); //create express object
const port = 5000; //port for server

//**************************
app.use(cors()); 
app.use(express.json()); 

//**************************
const uri = process.env.MONGODB_URL; //load mongodb connection key 
mongoose.set("strictQuery", true); //ensure queries follow the correspondng schema
mongoose.connect(uri); 

const connect = mongoose.connection; 
connect.once("open", () => {console.log("Successfully Established MongoDB connection")});

const userRouter = require("./Routes/Users.js");

app.use("/users", userRouter)

app.listen(port, () =>{ 
    console.log(`running on port ${port}`);
})