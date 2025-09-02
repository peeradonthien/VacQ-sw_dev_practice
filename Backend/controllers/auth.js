const User = require('../models/User');

//@desc    Register User
//@route   POST /api/v1/auth/register
//@access  Public
exports.register = async (req,res,next) => {
    try {
        const {name,email,password,role} = req.body;

        //Create User
        const user = await User.create({name,email,password,role});

        //Create Token and sent to cookie by call function
        sendTokenResponse(user,200,res);
    } catch (error) {
        res.status(400).json({success:false});
        console.log(error.stack);
    }
};

//@desc    Login User
//@route   POST /api/v1/auth/login
//@access  Public
exports.login = async (req,res,next) => {
    const {email,password} = req.body;
    //Validate email & password
    if(!email || !password){
        return res.status(400).json({success:false, msg:'Please provide an email and password'});
    }

    //Check for user
    const user = await User.findOne({email}).select('+password');
    if(!user){
        return res.status(400).json({success:false, msg:'Invalid credentials'});
    }

    //Check if password matches
    const isMatch = await user.matchPassword(password); 
    if(!isMatch){
        return res.status(401).json({success:false, msg:'Invalid credentials'});
    }

    //Create Token and sent to cookie by call function
    sendTokenResponse(user,200,res);

};

//Get token from model, create cookie and send response
const sendTokenResponse = (user , statusCode , res) => {
    //Create Token
    const token = user.getSignedJwtToken();
    const options = {
        expires : new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE*24*60*60*1000), //convert day to ms
        httpOnly : true //ให้cookie เข้าถึงได้เฉพาะฝั่ง server เท่านั้น
    };

    if(process.env.NODE_ENV == 'production'){
        options.secure = true;
    };

    res.status(statusCode).cookie('token',token,options).json({success:true, token});
}


//@desc    Get current Logged in user
//@route   POST /api/v1/auth/me
//@access  Private
exports.getMe = async (req,res,next) =>{
    const user = await User.findById(req.user.id);
    res.status(200).json({success:true, data:user})
}