// client/components/DrawingBoard.jsx
import React, { useRef, useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useTeamStore } from "../store/useTeamStore";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

const DrawingBoard = () => {
  const { authUser } = useAuthStore();
  const { selectedTeam } = useTeamStore();
  const [socket, setSocket] = useState(null);

  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color,setColor]=useState("#000000");
  const userId=authUser._d;
  const username=authUser.fullName;

  const [activeDrawers, setActiveDrawers] = useState([]);

useEffect(() => {
  if (!socket) return;

  socket.on("drawing-users", (users) => {
    setActiveDrawers(users);
  });

  return () => socket.off("drawing-users");
}, [socket]);

  useEffect(() => {
    if (ctxRef.current) {
      ctxRef.current.strokeStyle = color;
    }
  }, [color]);
  const clearCanvas=()=>{
    const canvas = canvasRef.current;
    ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
  }
  useEffect(() => {
    if (!authUser?._id) return;

    const newSocket = io("http://localhost:5001", {
      query: { userId: authUser._id },
      username: authUser.fullName,
    teamId: selectedTeam?._id,
    },);
    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, [authUser, selectedTeam?._id]);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 800;
    canvas.height = 500;

    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctxRef.current = ctx;
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("draw", ({ offsetX, offsetY }) => {
      ctxRef.current.lineTo(offsetX, offsetY);
      ctxRef.current.stroke();
    });

    socket.on("drawing-started-notify", ({ username }) => {
      toast(`${username} started drawing ✍️`);
    });

    return () => socket.off("draw");
  }, [socket]);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    ctxRef.current.strokeStyle = color;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
    socket.emit("start-drawing", { userId,username });
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing || !socket) return;

    const { offsetX, offsetY } = nativeEvent;
    ctxRef.current.lineTo(offsetX, offsetY);
    ctxRef.current.stroke();

    socket.emit("draw", { offsetX, offsetY });
  };

  const stopDrawing = () => {
    ctxRef.current.closePath();
    setIsDrawing(false);
    socket.emit("stop-drawing", { userId });
  };
  const saveCanvas = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "drawing.png";
    link.href = canvas.toDataURL(); 
    link.click(); 
  };
  

  return (<>
    <div className="mb-2 flex gap-4">
    <input
      type="color"
      value={color}
      onChange={(e) => setColor(e.target.value)}
    />
    <button
      onClick={clearCanvas}
      className="px-4 py-1 bg-red-500 text-white rounded"
    >
      Clear Canvas
    </button>
    <button
  onClick={saveCanvas}
  className="px-4 py-1 bg-green-500 text-white rounded"
>
  Save as PNG
</button>
{activeDrawers.length > 0 && (
  <p className="text-sm text-blue-500">
    🖌️ {activeDrawers.join(", ")} {activeDrawers.length === 1 ? "is" : "are"} drawing...
  </p>
)}

  </div>
    <canvas
      ref={canvasRef}
      className="border border-gray-400 rounded"
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
    />
    

    </>
  );
};

export default DrawingBoard;
