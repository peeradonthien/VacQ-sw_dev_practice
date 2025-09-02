const Hospital = require('../models/Hospital'); // ../ คือออกจาก folder นี้
const Appointment = require('../models/Appointment');

//@desc   Get all hospitals 
//@route  GET /api/v1/hospitals
//@access Public
exports.getHospitals = async (req,res,next) => {
    let query;

    //Copy req.query
    const reqQuery = {...req.query};

    //Field to exclude
    const removeFields = ['select' , 'sort'];

    //ลบ select sort ออกไปก่อน
    removeFields.forEach(param=>delete reqQuery[param]);
    console.log(reqQuery);

    let queryStr = JSON.stringify(reqQuery);
    //ทำ operator ก่อน
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g,match => `$${match}`);
    query = Hospital.find(JSON.parse(queryStr)).populate('appointments');

    //select Fields
    if(req.query.select){
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    //sort
    if(req.query.sort){
        const sortBy =  req.query.sort.split(',').join(' ');
        query = query.sort(sortBy); 
    }
    else{
        query = query.sort('-createdAt'); //sort by time that created
    }

    //Pagination
    const page = parseInt(req.query.page,10) || 1;
    const limit = parseInt(req.query.limit,10) || 25;
    const startIndex = (page-1)*limit;
    const endIndex = page*limit;
    const total = await Hospital.countDocuments();

    query = query.skip(startIndex).limit(limit);

    //Pagination result
    const pagination = {};

    if(endIndex < total){
        pagination.next = {
            page : page+1,
            limit
        }
    }
    if(startIndex > 0){
        pagination.prev = {
            page : page-1,
            limit
        }
    }

    try{
        //Executing query
        const hospitals = await query;
        res.status(200).json({success:true, count:hospitals.length , data:hospitals});
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
        const hospital = await Hospital.findById(req.params.id);

        if(!hospital){ //if not found
            return res.status(404).json({status : false,message:`Hospital not found with id of ${req.params.id}`});
        }
        //if found
        await Appointment.deleteMany({hospital:req.params.id});
        await Hospital.deleteOne({_id:req.params.id});
        
        res.status(200).json({status:true,data : {}});
    } catch (error) {
        res.status(400).json({status : false});
    }
};

