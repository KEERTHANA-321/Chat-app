import {Server} from "socket.io"
import http from "http"
import express from "express"

const app=express();
const server=http.createServer(app);

const io=new Server(server,{
    cors:{
        origin:["http://localhost:5173"]
    }
})

export function getRecieverSocketId(userId){
    return userSocketMap[userId];
}

const userSocketMap={};
const activeDrawers={};


io.on("connection",(socket)=>{
    const userId=socket.handshake.query.userId;
    const username=socket.handshake.query.username;
    const teamId = socket.handshake.query.teamId;
    console.log('A user connected',socket.id);
    if(userId) userSocketMap[userId]=socket.id;
    io.emit("getOnlineUsers",Object.keys(userSocketMap));
    socket.on("disconnect",()=>{
        console.log("A user disconnected",socket.id)
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap));

        
    })
    socket.on("draw", (data) => {
        socket.broadcast.emit("draw", data);
      });
    
    

    socket.on("start-drawing",({userId,username})=>{
        if(!activeDrawers[teamId]) activeDrawers[teamId]=new Set();
        activeDrawers[teamId].add(username);

        io.to(teamId).emit("drawing-users",[...activeDrawers[teamId]]);
        socket.to(teamId).emit("drawing-started-notify",{username});

        console.log(`${username} started drawing`)
    })

    socket.on("stop-drawing",({userId,username})=>{
        if(activeDrawers[teamId]){
        activeDrawers[teamId].delete(username);
        io.to(teamId).emit("drawing-users",[...activeDrawers[teamId]]);
        }
        if (!activeDrawers[teamId]) {
            activeDrawers[teamId] = new Set();
          }
          

        socket.join(teamId);

        io.to(teamId).emit("drawing-users",[...activeDrawers[teamId]]);
        socket.to(teamId).emit("drawing-started-notify",{username});

        console.log(`${username} started drawing`)
    })

    socket.on("disconnect", () => {
        console.log(" User disconnected:", socket.id);
        delete userSocketMap[userId];
    
        if (activeDrawers[teamId]) {
          activeDrawers[teamId].delete(username);
          io.to(teamId).emit("drawing-users", [...activeDrawers[teamId]]);
        }
    
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
      });

})

export {io,app,server};
