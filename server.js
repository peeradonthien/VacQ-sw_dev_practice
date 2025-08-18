const express = require('express');
const dotenv = require('dotenv');

//Load env vars
dotenv.config({path: './config/config.env'});
const app=express();

// เดิมเป็นเเบบนี้อยู่ที่ server.js เเต่เราเเยกออกมาเป็น router เพื่อความเป็นระเบียบ
// app.get('/api/v1/hospitals' , (req,res) => {
//     res.status(200).json({success:true, msg:'Show all hospitals'});
// });

//เมื่อมี request เข้ามาเเล้วอ้างอิงไปที่ /api/v1/hospitals' มันก็จะส่งไปที่ hospitals.js
const hospitals = require('./routes/hospitals');
app.use('/api/v1/hospitals',hospitals); 


const PORT=process.env.PORT || 5000;
app.listen(PORT, console.log('Server running in ', process.env.NODE_ENV, ' mode on port ', PORT));