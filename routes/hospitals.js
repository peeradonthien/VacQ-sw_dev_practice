// require express
const express = require('express');
const {getHospitals,getHospital,createHospital,updateHospital,deleteHospital} = require('../controllers/hospitals')
const router = express.Router(); // ใช้ตัวเเปร router เเทน app เพราะ app เอาไปไว้ที่ server.js

router.route('/').get(getHospitals).post(createHospital);
router.route('/:id').get(getHospital).put(updateHospital).delete(deleteHospital);


module.exports = router; // export ตัวเเปร router ให้ไฟล์อื่นรู้จัก


