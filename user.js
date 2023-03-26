const mongoose=require("mongoose");
const express=require("express");
const app=express();

const port=process.env.PORT || 3000;

const conn=require("./src/db/conn");
// const regapi=require("./src/models/demo");

const playlistRouter=require('./src/routers/playlist');
const User = require("./src/models/demo");

app.use(express.json());
app.use(playlistRouter);

//insert user
const insertuser=async()=>{
   try{
       const user=new User({
         Name:"Souvick",
         Emailid:"s@gmail.com",
         Password:1234,
         Phno:12345,
         age:21,
         Address:"gurap"
       })
       const user1=new User({
        Name:"Subham",
        Emailid:"b@gmail.com",
        Password:4321,
        Phno:123123,
        age:18,
        Address:"barasat"
      })
       const result=await User.insertMany([user,user1]);
       console.log(result);
   }
   catch(err){
     console.log(err);   
    }
}
insertuser();


app.listen(port,()=>{
   console.log(`Listening the port ${port}`);
   })