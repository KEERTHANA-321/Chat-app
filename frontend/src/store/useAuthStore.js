import {create} from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
const BASE_URL="http://localhost:5001"
export const useAuthStore=create((set,get)=>({
    authUser:null,
    isSigningUp:false,
    isLoggingin:false,
    isUpdatingProfile:false,
    ischeckingAuth:true,
    onlineUsers:[],
    socket:null,

    checkAuth:async()=>{
        try{
            const res=await axiosInstance.get("/auth/check");
            set({authUser:res.data})
            get().connectSocket();

        }catch(err){
            console.log("error in checkauth call",err)
            set({authUser:null})

        }finally{
            set({ischeckingAuth:false})
        }
    },
    signUp:async (data)=>{
        set({isSigningUp:true})
        try{
            const res=await axiosInstance.post("/auth/signup",data);
            set({authUser:res.data});

            toast.success("Account created successfully");
            get().connectSocket();

        }catch(err){
            toast.error(err.response.data.message);
        }finally{
            set({isSigningUp:false})
        }
    },
    logOut:async ()=>{
        try{
            await axiosInstance.post("/auth/logout");
            set({authUser:null})
            toast.success("Logged Out successfully");
            get().disconnectSocket();


        }catch(err){
            toast.error(err.response.data.message);
        }
    },
    logIn:async (data)=>{
        set({isLoggingin:true})
        try{
            const res=await axiosInstance.post("/auth/login",data);
            set({authUser:res.data});

            toast.success("Logged in successfully");
            get().connectSocket();
        }catch(err){
            toast.error(err.response.data.message);
        }finally{
            set({isLoggingin:false})
        }
    },
    updateProfile:async (data)=>{
        set({isUpdatingProfile:true});
        try {
            const res=await axiosInstance.put("/auth/updateprofile",data);
            set({authUser:res.data});
            toast.success("Profile Updated Successfully")
        } catch (error) {
            toast.error("Error in updating Profile",error)
        }finally{
            set({isUpdatingProfile:false})
        }

    },
    connectSocket:()=>{
        const {authUser}=get();
        if(!authUser || get().socket?.connected){
            return;
        }
        const socket=io(BASE_URL,{
            query:{
                userId:authUser._id,
            }
        });
        socket.connect();
        set({socket:socket});
        socket.on("getOnlineUsers" ,(userIds)=>{
            set({onlineUsers:userIds});
        })
    },
    disconnectSocket:()=>{
        if(get().socket?.connect) get().socket.disconnect();
    }
})) 