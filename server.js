const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

//Load env vars
dotenv.config({path: './config/config.env'});

//Connect to DB
connectDB();

const app=express();

//Body Parser
app.use(express.json());

// Route files
const hospitals = require('./routes/hospitals');
app.use('/api/v1/hospitals',hospitals); 

const PORT=process.env.PORT || 5000;

const server = app.listen(PORT, console.log('Server running in ', process.env.NODE_ENV, ' mode on port ', PORT));

//Handle Error
process.on('unhandledRejection',(err,promise) => {
    console.log(`Error: ${err.message}`);
    //close server and exit process if have error
    server.close(()=>process.exit(1));
});