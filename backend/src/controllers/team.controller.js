import User from "../models/user.model.js";
import Team from "../models/team.model.js";
import {io} from "../lib/socket.js"
import Message from "../models/message.model.js";


export const fetchTeams=async(req,res)=>{
    try{
        const userId=req.user._id;
        const user=await User.findById(userId).populate("teams");
        if(!user) return res.status(404).json({message:"User not found"});
        res.status(200).json(user.teams);
    }catch(err){
        console.log("error in fetchTeam controller",err);
        res.status(500).json({message:"server error"});
    }
};


const generateInviteCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
  };
  
export const createTeam=async(req,res)=>{
    try{
        const userId=req.user._id;
        const {name,description}=req.body;


        let inviteCode = generateInviteCode();
        while (await Team.findOne({ inviteCode })) {
            inviteCode = generateInviteCode();
          }
        // const existingTeam = await Team.findOne({ name });
        // if (existingTeam) {
        // return res.status(400).json({ message: "Team name already exists" });
        // }
        
        const newTeam=new Team({
            name:name,
            description:description,
            inviteCode:inviteCode
        });
        await  newTeam.save();

        await User.findByIdAndUpdate(userId, {
            $push: { teams: newTeam._id }
          });
          res.status(201).json(newTeam);


        


    }catch(err){
        console.log("error in createTeam controller",err);
        res.status(500).json({message:"server error"});
    }
}

export const joinTeam=async (req,res)=>{
    try {
        const userId=req.user._id;
        const {inviteCode}=req.body;
        const team=await Team.findOne({inviteCode:inviteCode});
        if(!team) {
            return res.status(400).json({message:"Invalid invite Code"});
        }
        const user = await User.findById(userId);
        if (user.teams.includes(team._id)) {
            return res.status(400).json({ message: "Already a member of this team" });
        }
        await User.findByIdAndUpdate(userId,{
            $push:{teams:team._id}
        })
        res.status(201).json({ message: "Joined team successfully", team })

    } catch (error) {
        console.log("error in joinTeam controller",error);
        res.status(500).json({message:"server error"});
    }
}
export const getTeamMembers = async (req, res) => {
    try {
      const { teamid } = req.params;
  
      const members = await User.find({ teams: teamid }).select('fullName profilePic');
  
      res.json(members);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch team members' });
    }
  };

export const sendMessageToTeam=async (req,res)=>{
    try{
        const {teamid}=req.params;
        const {text,image}=req.body;
        const senderId=req.user._id;
        const user = await User.findById(senderId);
        if (!user.teams.includes(teamid)) {
            return res.status(403).json({ message: "You are not a member of this team" });
        }

        let imageUrl;
                if(image){
                    const uploadResponse= await cloudinary.uploader.upload(image);
                    imageUrl=uploadResponse.secure_url;
                }
    
    const newMessage=new Message({
        senderId,
        teamId:teamid   ,
        text,
        image:imageUrl,
    });
    await newMessage.save();

    io.emit("newTeamMessage",newMessage);
    res.status(200).json(newMessage);

    
    


}catch(err){
    console.log("error in sendmessage team controller",err);
    res.status(500).json({message:"server error"});
}
};

export const getTeamMessages=async (req,res)=>{
    try {
        const { teamid } = req.params;
        const messages = await Message.find({ teamId: teamid }).populate("senderId", "fullName profilePic");
        res.status(200).json(messages);
      } catch (err) {
        console.log("error fetching team messages", err);
        res.status(500).json({ message: "server error" });
      }
}