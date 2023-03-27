const mongoose=require("mongoose")

const postSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    device:{
        type:String,
        required:true,
        enum:["Loptop","Tablet","Mobile"]
    },
    no_of_comments:{
        type:Number,
        required:true,
        default:0
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
},{
    timestamps:true,
    versionKey:false
})

const postModel=mongoose.model("Post",postSchema)

module.exports={
    postModel
}