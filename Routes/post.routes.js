const express=require("express")
const postRouter=express.Router()
const {postModel}=require("../Models/post.mode")
const jwt=require("jsonwebtoken")

// Get posts
postRouter.get("/",async(req,res)=>{
    const token=req.headers.authorization
    const decoded=jwt.verify(token,"code")
    const { page=1, userID, minComments=0, maxComments=Number.MAX_SAFE_INTEGER, device } = req.query
    const limit = 3
    const skip = (page - 1) * limit
    try{
        if(decoded){
            let query = {"userID":decoded.userID}
            if (userID) {
                query.userID = userID
            }
            query.comments = { $gte: minComments, $lte: maxComments }
            if (device) {
                query.device = { $in: device.split(",") }
            }
            const count = await postModel.countDocuments(query)
            const posts=await postModel.find(query).limit(limit).skip(skip)
            res.status(200).send({posts, totalPages: Math.ceil(count / limit)})
        }
    } catch(err){
        res.status(400).send({"msg":err.message}) 
    }
})

// Get top posts based on comments
postRouter.get("/top",async(req,res)=>{
    const token=req.headers.authorization
    const decoded=jwt.verify(token,"code")
    const { page=1, limit=3 } = req.query
    try{
        if(decoded){
            const posts=await postModel.aggregate([
                { $match: { userID: decoded.userID } },
                { $sort: { comments: -1 } },
                { $limit: parseInt(limit) },
                { $skip: (page - 1) * limit },
            ])
            res.status(200).send(posts)
        }
    } catch(err){
        res.status(400).send({"msg":err.message}) 
    }
})

// Add post
postRouter.post("/add", async(req,res)=>{
    try{
    const note=new postModel(req.body)
    await note.save()
    res.status(200).send({"Msz":"A New Note has been added"})
    }catch(err){
        res.status(400).send({"msz":"Wrong Token"})
    }
})

// Update posts
postRouter.patch("/update/:postID", async (req, res) => {
    let { postID } = req.params
    let newbody = req.body
    try {
        await postModel.findByIdAndUpdate({ _id: postID }, newbody)
        res.send({message: "Note data updated succesfully" })
    } catch (error) {
        res.send({ message: "some error occured while updating" })
        console.log(error)
    }
})

// Delete post
postRouter.delete("/delete/:postID", async (req, res) => {
    let  { postID } = req.params
    try {
        await postModel.findByIdAndDelete({ _id: postID })
        res.send({ message: "Deleted succesfully" })
    } catch (error) {
        res.send({ "error": "some error occured while deleting" })
    }
})

module.exports={
    postRouter
}
