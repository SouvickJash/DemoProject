const mongoose=require("mongoose");
const bcrypt = require('bcrypt');
const jwt=require("jsonwebtoken");
const apiScheme=new mongoose.Schema({

    Name:{
      type:String,
      required:true,
    },
    Emailid:{
         type:String,
         required:true,
         unique:true,
    },
    Password:{
      type:String,
      required:true,
    },
    Phno:{
      type:Number,
      required:true,
      unique:true,
    },
    Age:{
        type:Number,
        required:true,
    },
    Address:{
      type:String,
      required:true,
    },
    Date:{
      type:Date,
      default : Date.now
    },
    image:{
       type:String,
       required:true,
    },
    tokens:[{
      token:{
        type:String,
        required:true,
      }
    }]
})


//token middleware
apiScheme.methods.generateAuthToken= async function(){
  try{
      const token= jwt.sign({_id : this._id},"mynameissouvickjashiamprogrammerandlearnlotsoftechnology");
      // this.token=this.token.concat({token:token});
      await this.save();
      return token;

  }
  catch(error){
      // res.send("The error part is"+error);
      console.log("The error part is"+error);
  }
}

//password
apiScheme.pre("save",async function(next){ 
      
     if(this.isModified("Password"))
     {
      this.Password= await bcrypt.hash( this.Password,10);
      console.log( this.Password);
     }

      next();
})

//model creation
const User = new mongoose.model("User",apiScheme);
module.exports = User;

