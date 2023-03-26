const express = require("express");
const { model} = require("mongoose");
const router = new express.Router();
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const cookieParser = require("cookie-parser");
const path = require("path");
const hbs = require("hbs");
const User = require("../models/demo");
const bcrypt = require('bcrypt');
const upload = require('../middleware/upload');

const join=require('../models/semester');

const app = express();


const staticPath = path.join(__dirname, "../public");
const templatePath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

app.set('view engine', 'hbs');
app.set('views', templatePath);
hbs.registerPartials(partialsPath);
app.use(express.static(staticPath));

app.use(cookieParser());

//insert
router.post("/insert",async (req, res) => {

    try {
        console.log("hiiii");
        const data=new join(req.body);
        const createUser = await data.save();
        console.log("....",createUser);
        return (res.status(200).json({
            status: 200,
            message: "successfully registe",
            
         }));
 } 
 catch (error) {
        res.status(500).send(error);
    }
})

//get api
router.get("/getapi",async(req, res)=>{
    try{
      console.log(req.body.id);
      const details=await join.findOne({_id:req.body.id});
      console.log(details);
      
      const data=await User.findOne({_id:exam.student_id})
       console.log("++",data);
       const result={
         Emailid:data.Emailid,
         Address:data.Address,
         Age:data.Age
}
    
    console.log("/////",result);
        return(res.status(200).json({
            status:200,
            message:"sucess",
            newdata:result
        }))
    }  
    
    catch(err){
       return(res.status(500).json({
        status:500,
        message:"error"
       }))
    }
})




//first page
router.get('/', (req, res) => {
    res.send("login");

})
router.get('/register', (req, res) => {
    res.render("register")

})
//search by leater by name
router.get("/searchlater/:key",async(req,res)=>{
    try{
        const key = req.params.key;
        console.log(key);
        const x=await User.find(
        { "Name": { $regex: /^j.*/ } }

         )
         if(x){
            return(res.status(200).json({

                status :200,
                message:"Success",
                newdata:[x]
            }));
         }
       
    }
    catch(err){
        console.log(err);
    }
})



//search by name
router.post("/search", async (req, res) => {
    try {


        var name = req.body.Name
        const newdata = await User.find({
            Name: name
        });
        
        if (newdata) {
            return(res.status(200).json({

                     status :200,
                     message:"Success",
                     newdata:[newdata]
                 }));
            //  res.status(200).json(newdata);
        } else {
            res.status(401).json("not found");
            
        }
        
        // if (newdata) {

        //     console.log(newdata);
        //     res.send("success");
            // return(res.status(200).json({

            //     status :200,
            //     message:"Success",
            //     newdata:[newdata]
            // }));



            // console.log(newdata._id);

            //  res.send("success")
        // } else {
        //     res.send("fail")
        //     console.log("fail");
            // return(res.status(400).json({

            //     status :400,
            //     error:"plz enter valid name"

            // }));
        }

     catch (err) {
        console.log(err);
    }
})


//login user
router.post("/login", async (req, res) => {

    console.log(req.body);
    const {
        Emailid,
        Password
    } = req.body;
    //  console.log(Emailid);
    //  console.log(Password);

    if (!Emailid || !Password) {
        console.log("Plz fill up details");
        return (res.status(400).json({
            error: "plz fill up your details"
        }));

    } else {

        try {
            const userLogin = await User.findOne({
                Emailid: Emailid
            });

        if (userLogin) {
                const isMatch = await bcrypt.compare(Password, userLogin.Password); //right
                //
                const token = await userLogin.generateAuthToken(); //right 
                console.log("The token part" + token);

                res.cookie("jwt", token, {
                    //if i want
                    expires: new Date(Date.now() + 80000),
                    httpOnly: true
                });
                //

                // console.log(`This is the cookie ${req.cookies.jwt}`)
              //local storage
                //let a=window.localStorage.setItem('token',token);
                //console.log(a);

            if (!isMatch) {
                    console.log("plz send your correct password");
                    return (res.status(400).json({
                        status: 400,
                        error: "plz send your correct password"
                    }));

                    //console.log()
                } else {
                    return (res.status(201).json({
                        status: 200,
                        message: "login successfull"

                    }));

                }


            } else {
                return (res.status(400).json({
                    status: 400,
                    error: "Plz fill you correct emailid"
                }));

            }

        } catch (e) {
            console.log(e);

        }
        console.log("sucess");
    }
})




//insert data with image(register)
router.post("/User", upload, async (req, res) => {

    try {

        console.log(req.file);

        if (req.body.Password === req.body.confrompassword) {
            const user = new User({
                Name: req.body.Name,
                Emailid: req.body.Emailid,
                Password: req.body.Password,
                Phno: req.body.Phno,
                Age: req.body.Age,
                Address: req.body.Address,
                image: req.file.filename
            });
            //password & cfrm matching
            const createUser = await user.save();

            //    res.status(201).send("success");
            console.log("suceess");
            return (res.status(200).json({

                status: 200,
                message: "successfully register"


            }));

        } else {
            // res.status(500).send(error);
            console.log("password is not matching");
            //  res.send("password is not matching");

            return (res.status(400).json({

                status: 400,
                error: "password is not matching"
            }));
        }


    } catch (error) {
        res.status(500).send(error);
    }
})



//get
router.get('/getdata', async (req, res) => {

    try {
        const getuser = await User.find();
        res.send(getuser);
    } catch (e) {
        res.status(500).send(e);
    }
})


//update
router.patch("/User/:id", async (req, res) => {
    try {
        const _id = req.params.id;
        const updateData = await User.findByIdAndUpdate(_id, req.body, {
            new: true
        });
        res.send(updateData);

    } catch (e) {
        res.status(404).send(updateData);
    }
})


//update another
router.patch("/changepassword/:id", async (req, res) => {
    try {

        console.log(req.body);
        // const data=await User.findOne(req.params.id);
        const data = await User.findOne({
            _id: req.params.id
        });
        // console.log(data.Password);

        if (req.body.newpassword === req.body.confrompassword) {

            // User.Password.updateOne({_id:req.params.id})
            const userdata = await User.findByIdAndUpdate({
                _id: data
            }, {
                Password: newpassword
            }, {
                new: true
            });
            res.send("password updated")
            console.log("success");

        } else {
            console.log("password not match");
            res.send("password not match");
        }
        // res.send("success");
    } catch (e) {
        res.status(404).send("fail");
    }
})




//delete
router.delete("/delete/:id", async (req, res) => {
    try {

        const deleteData = await User.findByIdAndDelete(req.params.id);
        if (!req.params.id) {
            res.status(404).send();
        } else {
            res.send(deleteData);
        }


    } catch (e) {
        res.status(500).send(e);
    }
})

//
router.get('/profilepage', auth, (req, res) => {
    try {
        return (res.status(200).json({
            status: 200,
            messaged: "sucess"
        }));

    } catch (e) {
        console.log(e);
    }
})

//logout
router.get('/logout', (req, res) => {
    try {
        jwt.destroy(token)
        res.send("logout")
        console.log("logout");
    } catch (e) {
        console.log(e);
    }
})


module.exports = router;