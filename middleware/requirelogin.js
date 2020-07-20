const { json } = require("body-parser");
const jwt =require('jsonwebtoken');
const {JWT_KEYS} = require('../keys')
const mongoose = require('mongoose')
const User = mongoose.model("User")
module.exports=(req,res,next)=>{
const {authorization} = req.headers;
if(!authorization){
    res.status(422).json({error:"You must be logged in"})
}
const token =  authorization.replace("bearer","")
jwt.verify(token,JWT_KEYS,(err,payload)=>{

    if(err){
          res.status(422).json({error:"You must be logged in"})
    }

    const {_id} = payload
    User.findById(_id).then(userdata=>{
        req.user = userdata
    })
    next()

})
}