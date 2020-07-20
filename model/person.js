const mongoose = require('mongoose');

const personSchema = new mongoose.Schema(
    {
        fname:{
            type:String,
            required:true
        },
        lname:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        phone:{
            type:Number,
            required:true
        },
        message:{
            type:String,
            required:true
        },

       
        
    }
)
mongoose.model("Person",personSchema);
