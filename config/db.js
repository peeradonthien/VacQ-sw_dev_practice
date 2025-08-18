const mongoose = require('mongoose');

const connectDB = async () => { 
    mongoose.set('strictQuery' , true);
    const conn = await mongoose.connect(process.env.MONGO_URI,{ //method ต้องรอผลลัพธ์
        useNewUrlParser: true,  //บอกให้ Mongoose ใช้ parser รุ่นใหม่ของ MongoDB driver
        useUnifiedTopology: true //ใช้งานUnified Topology Engine รุ่นใหม่ของ MongoDB driver
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
}

module.exports = connectDB;