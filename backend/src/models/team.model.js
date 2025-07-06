import mongoose from "mongoose";

const teamSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    image:{
        type:String
    },
    description:{
        type:String,
        default:""
    },
    inviteCode: {
        type: String,
        required: true,
        unique: true
    }
},{timestamps:true})

const Team=mongoose.model("Team",teamSchema);
export default Team;