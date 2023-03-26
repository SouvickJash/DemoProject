const jwt=require("jsonwebtoken");
const User=require("../models/demo");


const auth=async (req,res,next)=>{

    try{
       
      //   const token=req.cookies;
        console.log("check.",token);
        const verifyUser=jwt.verify(token,"mynameissouvickjashiamprogrammerandlearnlotsoftechnology");

        const user=await User.findOne({_id:verifyUser._id});
        console.log(user.email);

        req.token=token;
        req.user=user;

        next();


    }
    catch(error){
        res.status(401).send(error);

    }
}
module.exports=auth;