import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute=async (req,res,next)=>{
    try{
        const token=req.cookies.jwt;
        console.log("Token from cookies:", token);
        if(!token){
            return res.status(401).json({message:"unauthorized-no token provided"});
        }
        const decoded= jwt.verify(token,process.env.JWT_SECRET);
        console.log("Decoded JWT:", decoded);
        if(!decoded){
            return res.status(401).json({message:"unauthorized-invalid token"});
        }
        const user =await User.findById(decoded.userId).select("-password");
        console.log("User fetched from DB:", user);
        if(!user){
            return res.status(404).json({message:"user not found"});
        }

        req.user=user;
        next();
    }catch(err){
        console.log("error in protectroute middleware",err.message);
        res.status(500).json({message:"server error"})
    }
}