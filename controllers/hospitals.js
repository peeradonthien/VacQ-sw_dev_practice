const Hospital = require('../models/Hospital'); // ../ คือออกจาก folder นี้

//@desc   Get all hospitals 
//@route  GET /api/v1/hospitals
//@access Public
exports.getHospitals = async (req,res,next) => {
    try{
        const hospitals = await Hospital.find();
        res.status(200).json({success:true, count:hospitals.length, data:hospitals});
    } catch(error){
        res.status(400).json({success:false});
    }
};

//@desc   Get single hospitals 
//@route  GET /api/v1/hospitals/:id
//@access Public
exports.getHospital = async(req,res,next) => {
    try{
        const hospital = await Hospital.findById(req.params.id);

        //if not found
        if(!hospital){
            return res.status(400).json({success : false});
        }
        res.status(200).json({success:true, data:hospital});
    }catch(error){
        res.status(400).json({success : false});
    }
};

//@desc   Create new hospital
//@route  POST /api/v1/hospitals
//@access Private
exports.createHospital= async (req,res,next) => {
    const hospital = await Hospital.create(req.body);
    res.status(201).json({success : true, data : hospital});
};

//@desc   Update hospital
//@route  PUT /api/v1/hospitals/:id
//@access Private
exports.updateHospital = async(req,res,next) => {
    try {
        const hospital = await Hospital.findByIdAndUpdate(req.params.id , req.body,{
            new : true, //ให้คืนค่าที่พึ่งอัพเดทใหม่กลับมา (ถ้าไม่true จะคืนค่าเก่า)
            runValidators : true //check ข้อมูลว่าตรงกับ schema เดิมมั้ย
        });
        if(!hospital){
            return res.status(400).json({status : false});
        }
        res.status(200).json({status :true, data:hospital});

    } catch (error) {
        res.status(400).json({status : false});
    }
};

//@desc   Delete hospital
//@route  DELETE /api/v1/hospitals/:id
//@access Private
exports.deleteHospital = async(req,res,next) => {
    try {
        const hospital = await Hospital.findByIdAndDelete(req.params.id);

        if(!hospital){
            return res.status(400).json({status : false});
        }
        
        res.status(200).json({status:true,data : {}});
    } catch (error) {
        res.status(400).json({status : false});
    }
};

