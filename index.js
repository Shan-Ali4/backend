const express=require("express")
const {connection}=require("./db")
const cors=require("cors")
const {userRouter}=require("./Routes/user.routes")
const {postRouter}=require("./Routes/post.routes")
const {auth}=require("./Middleware/auth")
require("dotenv").config()
const app=express()
app.use(express.json())
app.use(cors())

// app.use(auth)
app.use("/users",userRouter)
app.use("/posts",postRouter)


app.listen(process.env.PORT,async()=>{
    try{
        await connection
        console.log("Connected With DB")
    }catch(err){
        console.log(err)
    }
    console.log(`Server is running at port ${process.env.PORT} `)
})