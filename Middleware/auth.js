const jwt=require("jsonwebtoken")

const auth=(req,res,next)=>{
    const token=req.headers.authorization
    if(token){
        const decoded=jwt.verify(token,'code')
        if(decoded){
            req.body.userID=decoded.userID
            next()
        }else{
            res.status(400).send({message:"Plz Login First!"})
        }
    }else{
        res.status(400).send({message:"Didn't login"})
    }
}

module.exports={
    auth
}