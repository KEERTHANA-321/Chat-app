import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { createTeam, fetchTeams, getTeamMembers, getTeamMessages, joinTeam, sendMessageToTeam } from "../controllers/team.controller.js";

const router=express.Router();

router.get("/",protectRoute,fetchTeams);
router.post("/create",protectRoute,createTeam);
router.post("/join",protectRoute,joinTeam);
router.get("/:teamid/members",protectRoute,getTeamMembers);
router.get("/:teamid/messages",protectRoute,getTeamMessages);

router.post("/:teamid/sendmessages",protectRoute,sendMessageToTeam);



export default router;