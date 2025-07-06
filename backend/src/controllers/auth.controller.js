import generateToken from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from   "bcryptjs";
import cloudinary from "../lib/cloudinary.js";
export const signup= async (req,res)=>{
    const {fullName,email,password}=req.body;
    try{
        if(!password || !fullName || !email){
            return res.status(400).json({message:"fill all fields"});
        }
        if(password.length<6){
            return res.status(400).json({message:"Password length mustbe atleast 6"});
        }
        const user= await User.findOne({email});
        if(user) return res.status(400).json({message:"User already exisits"});

        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        const newUser=new User({
            fullName,
            email,
            password:hashedPassword,
        })
        if(newUser){
            generateToken(newUser._id,res);
            await newUser.save();
            res.status(201).json({_id:newUser._id,
                fullName:newUser.fullName,
                email:newUser.email,
                profilePic:newUser.profilePic,});
        }
        else{
            return res.status(400).json({
                    message:"invalid user data"
            });

        }

    }catch(err){
        console.log("error in signup controller",err.message);
        res.status(500).json({message:"server error"})
    }

}
export const login= async (req,res)=>{
    const {email,password}=req.body;
    try{
        if(!email || !password){
            return res.status(400).json({message:"all fields are required"});
        }
        
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"Invalid credentials"});
        }
        const isCorrect=await bcrypt.compare(password,user.password);
        if(isCorrect){
            generateToken(user._id,res);
            res.status(201).json({
                _id:user._id,
                fullName:user.fullName,
                email:user.email,
                profilePic:user.profilePic,
            })
        }
        else{
            return res.status(400).json({message:"Invalid credentials"});
        }
        
    }catch(err){
        console.log("error in login controller",err.message);
        res.status(500).json({message:"server error"})
    }

}
export const logout= (req,res)=>{
    try{
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message:"logged out"});
    }catch(err){
        console.log("error in logout controller",err.message);
        res.status(500).json({message:"server error"})
    }

}
export const updateProfile=async (req,res)=>{
    try{
        const {profilePic}=req.body;
        const userID=req.user._id;
        if(!profilePic){
            return res.status(400).json({message:"profile pic is required"});
        }
        const uploadResponse=await cloudinary.uploader.upload(profilePic);
        const updatedUser=await User.findByIdAndUpdate(userID,{
            profilePic:uploadResponse.secure_url
        },{new:true})
        res.status(200).json(updatedUser)
    }catch(err){
        console.log("error updating profile",err);
        res.status(500).json({message:"server error"});
    }
}

export const checkAuth= (req,res)=>{
    try{
        res.status(200).json(req.user);
    }catch(err){
        console.log("error in checkAuth controller",err);
        res.status(500).json({message:"server error"});
    }
}