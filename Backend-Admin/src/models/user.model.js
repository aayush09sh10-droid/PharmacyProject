import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        require:true, 
    },phone:{
        type:Number,
        require:true, 
    },password:{
        type:String,
        require:true, 
    },
    latitude:Number,
    longitude:Number,
    role:["User","Vendor","Admin"]
  
},{
    timestamps:true
})

export const User= mongoose.model("User",userSchema)