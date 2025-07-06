import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
// import { useAuthStore } from "./useAuthStore";

export const useTeamStore=create((set)=>({
    teams:[],
    currentTeam:null,
    isTeamsLoading:false,
    fetchTeams:async ()=>{
        set({isTeamsLoading:true});
        try{
            const res=await axiosInstance.get("/teams");
            set({teams:res.data});

        }catch (error) {
            toast.error(error.response.data.message)
        }finally{
           set({isTeamsLoading:false})
        }
    },
    createTeam:async (teamData)=>{
        set({isTeamsLoading:true});
        try{
            const res=await axiosInstance.post("/teams/create",teamData);
            toast.success("Team Created Successfully");
            set((state) => ({
                teams: [...state.teams, res.data],
                currentTeam: res.data
              }));
              return true;

        }catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
            return false;
        }finally{
           set({isTeamsLoading:false})
        }
    },
    joinTeam: async(inviteCode) => {
        set({ isTeamsLoading: true });
        try {
          const res = await axiosInstance.post("/teams/join", { inviteCode });
          toast.success("Joined team!");
          const team = res.data.team;
          set((state) => ({
            teams: [...state.teams, team],
            currentTeam: team
          }));
          return true;
        } catch (err) {
          toast.error(err.response?.data?.message || "Failed to join team");
          return false;
        } finally {
          set({ isTeamsLoading: false });
        }
      },
      setCurrentTeam: (team) => set({ currentTeam: team }),
      getTeamMembers: async (teamId) => {
        set({ isMembersLoading: true });
        try {
          const res = await axiosInstance.get(`/teams/${teamId}/members`);
          set({ members: res.data });
        } catch (error) {
          toast.error(error.response?.data?.message || "Failed to fetch members");
          set({ members: [] });
        } finally {
          set({ isMembersLoading: false });
        }
      },
}))