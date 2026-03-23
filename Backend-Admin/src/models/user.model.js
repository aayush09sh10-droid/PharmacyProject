import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true, 
        unique:true
    },phone:{
        type:Number,
        required:true, 
    },password:{
        type:String,
        required:true, 
    },
    latitude:Number,
    longitude:Number,
    role:{
        type:String,
        enum:["User","Admin","Vendor"],
        default:"User"
    }
  
},{
    timestamps:true
})

export const User= mongoose.model("User",userSchema)