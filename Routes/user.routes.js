const express= require("express")
const userRouter=express.Router()
const {UserModel}=require("../Models/user.model")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")

//Register
userRouter.post("/register",async(req,res)=>{
    const {name,email,gender,password,age,city,is_married}=req.body;
    try{
        const existingUser =await UserModel.findOne({email})
        if(existingUser){
            return res.status(400).json({message:"User already exist, please login"})
        }
        bcrypt.hash(password,5,async(err,hash)=>{
        const user = new UserModel({name,email,gender,password:hash,age,city,is_married})
        await user.save()
        console.log(user)
        res.status(200).send({msz:"Registraction has been done!"})
        })
    }catch(err){
        res.status(500).send({msz:"There is error",err})
    }
    
})

//Login
userRouter.post('/login',async(req,res)=>{
    const {email,password}=req.body
    try{
        const user = await UserModel.findOne({email})
        if(user){
            bcrypt.compare(password,user.password,(err,result)=>{
                if(result){
                    res.status(200).send({message:"Login Succecfully","token":jwt.sign({"userID":user._id},'code')})
                }else{
                    res.status(400).send({message:"Wrong Credentials"})
                }
            })
        }
    }catch(err){
        res.status(400).send({message:err.message})
    }
})
module.exports={
    userRouter
}