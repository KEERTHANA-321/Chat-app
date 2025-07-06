import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import { useTeamStore } from "./useTeamStore";

export const useChatStore=create((set,get)=>({
    messages:[],
    users:[],
    selectedUser:null,
    isUsersLoading:false,
    isMessagesLoading:false,

    getUsers:async ()=>{
        set({isUsersLoading:true});
        try {
            const res=await axiosInstance.get("/messages/users");
            set({users:res.data})
        } catch (error) {
            toast.error(error.response.data.message)
        }finally{
            set({isUsersLoading:false});
        }
    },
    getMessages: async (id, type = "user") => {
        set({ isMessagesLoading: true });
        try {
          const res = await axiosInstance.get(
            type === "team" ? `/teams/${id}/messages` : `/messages/${id}`
          );
          set({ messages: res.data });
        } catch (err) {
          toast.error("Failed to load messages",err);
        } finally {
          set({ isMessagesLoading: false });
        }
      },
      
    setSelectedUser:(selectedUser)=>set({selectedUser}),

    sendMessage:async (messageData,isTeam=false)=>{
        const {selectedUser,messages}=get();
        const { currentTeam } = useTeamStore.getState();
        try{
            let url=isTeam?`/teams/${currentTeam._id}/sendmessages`:`/messages/send/${selectedUser._id}`;
            const res=await axiosInstance.post(url,messageData);
            toast.success("message sent successfully")
            set({messages:[...messages,res.data]});
            
        }catch(err){
            toast.error(err.response.data.message)
        }
    },
    subscribeToMessages: () => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return;
      
        // Ensure we don’t double‐subscribe
        socket.off("newMessage");
      
        socket.on("newMessage", (newMessage) => {
          const { selectedUser, messages } = get();
          // only add if it belongs in the open conversation
          if (
            selectedUser &&
            (newMessage.senderId === selectedUser._id ||
             newMessage.receiverId === selectedUser._id)
          ) {
            set({ messages: [...messages, newMessage] });
          }
          // optionally: update unread counts for other chats here
        });
        socket.on("newTeamMessage", (newMessage) => {
          const { messages } = get();
          const { currentTeam } = useTeamStore.getState();

          const isDuplicate = messages.some((msg) => msg._id === newMessage._id);
      
          if (currentTeam && newMessage.teamId === currentTeam._id && !isDuplicate) {
            set({ messages: [...messages, newMessage] });
          }
        });
      },
    unsubscribeFromMessages:()=>{
        const socket=useAuthStore.getState().socket;
        socket.off("newMessage");
        socket.off("newTeamMessage");

    }

}))