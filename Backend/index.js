const express = require("express");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");
const cors = require("cors")
const {connnection} = require("./config/db");
const {UserModel} = require("./models/user.model");
const {BMIModel} = require("./models/bmiModel");
require("dotenv").config();
const {authentication} = require("./middleware/authentication")

const app = express();
app.use(cors());
app.use(express.json());

// home
app.get("/", (req, res)=>{
    res.send({msg:"home"});
});

// signup
app.post("/signup", async(req, res) => {
   const {name, email, password} = req.body;
   //  if User already exists
   const isUser = await UserModel.findOne({email});
   if(isUser){
    res.send({msg:"User already exists, try logging in"})
   }
   // else create new user 
   bcrypt.hash(password, 4, async function(err, hash) {
      if(err){
        res.send({msg:"signup failed"});
      }
        const new_user = new UserModel({
            name,
            email,
            password:hash
           });
           try{
              await new_user.save();
              res.send({msg:"user signed up successfully"})
           }catch(err){
              console.log({msg:"something went wrong"})
           }
    });
   
})

// login 
app.post("/login", async(req, res) =>{
    const {email, password} = req.body;
    const user = await UserModel.findOne({email});
    const hash_pass = user.password;
    const user_id = user._id;
   
    bcrypt.compare(password, hash_pass, function(err, result){
        if(err){
            res.send({msg:"something went wrong, try again later"})
        }if(result){
            const token = jwt.sign({user_id}, process.env.SECRET_KEY);
            res.send({message:"Login success",token})
        }else{
            res.send({msg:"Login failed"})
        }
    })
})

// getProfile
app.get("/getProfile", authentication, async(req, res)=>{
    const {user_id} = req.body;
    const user = await UserModel.findOne({_id: user_id});
    const {name, email} = user;
    res.send({email, name});
})

// calculate BMI
app.post("/calculateBMI", authentication, async(req, res)=>{
    const {height, weight, user_id} = req.body;
    const height_in_metre  = Number(height)*0.3048;
    const BMI = Number(weight)/(height_in_metre)**2;
    const new_BMI = new BMIModel({
        BMI,
        height:height_in_metre,
        weight,
        user_id
    })
    await new_BMI.save();
    res.send({BMI})
})

// getCalculation
app.get("/getCalculation", authentication, async(req, res)=>{
    const {user_id} = req.body;
    const all_BMI = await BMIModel.find({user_id: user_id})
    res.send({history: all_BMI})
})

// listen
app.listen(8080, async()=>{
    try{
        await connnection;
        console.log("Connection to DB successfull")
     }catch(e){
        console.log("Error connecting to DB")
    }
    console.log("listening on port 8080");
})