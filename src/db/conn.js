//

const mongoose = require('mongoose');
/*mongoose.connect("mongodb://127.0.0.1:27017/college")
.then(()=>console.log("connection successfuly"))
.catch((err)=>console.log("err"));*/

//async await use 
const connections=async()=>{
   try{
     await mongoose.connect("mongodb://127.0.0.1:27017/college");
     console.log("connection successfuly async await");
   }
   catch(err){
      console.log(err); 
   }
}
connections();