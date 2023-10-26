const express = require("express"); //our expres object
const cors = require("cors"); //our cors object
const mongoose = require("mongoose"); //our mongoose obj

require("dotenv").config(); // load env vars and call by process.env obj

//create express server
const app = express(); //create express object
const port = 5000; //port for server

//**************************
app.use(cors()); //configure cors in middleware for security purposes
app.use(express.json()); //will allow app obj to parse json data

//**************************
const uri = process.env.MONGODB_URL; //load mongodb connection key 
mongoose.set("strictQuery", true); //ensure queries follow the correspondng schema
mongoose.connect(uri); //establish connection

const connect = mongoose.connection; //connection obbject
connect.once("open", () => {console.log("Successfully Established MongoDB connection")});

const userRouter = require("./Routes/Users.js");
//insert any middleware between connect and listen
app.use("/users", userRouter)

app.listen(port, () =>{ //start your server
    console.log(`running on port ${port}`);
})