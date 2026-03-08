import mongoose from "mongoose";

const vendorSchema = new Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    licenseNumber:String,

    shopName:String,

    addressStreet:String,
    addressCity:String,
    addressState:String,
    addressPincode:String,

    latitude:Number,
    longitude:Number,
    openingTime:String,
    closingTime:String,

    phone:String,
    ratingCount:{
    type:Number,
    default:0
    }
},{timestamps:true})