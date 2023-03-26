const mongoose=require("mongoose");
const apiScheme=new mongoose.Schema({
    semname:{
      type:String,
      required:true
    },
   year:{
      type:Number,
      required:true
   },
   noofstudent:{
      type:Number,
      required:true
   },
   student_id:{
      type:mongoose.Schema.Types.ObjectId,
      ref: "users"
   },
   exam:{
      type:String,
      required:true
   }
})
//model creation
const join = new mongoose.model("Sem",apiScheme);
module.exports = join;

