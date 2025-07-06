import React, { useState, useEffect } from "react";
import { useTeamStore } from "../store/useTeamStore";
import { useAuthStore } from "../store/useAuthStore";
import DrawingBoard from "./DrawingBoard";

const Games = () => {
  const { teams, fetchTeams } = useTeamStore();
  const { onlineUsers } = useAuthStore();
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isDrawingActive, setIsDrawingActive] = useState(false);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const handleStartDrawing = () => {
    if (!selectedTeam) return;
    setIsDrawingActive(true);
  };

  return (
    <div className="p-6 custom-kodemono">
      <h1 className="text-2xl font-bold mb-4">Choose a Team</h1>

      <div className="space-y-4">
        {teams.map((team) => (
          <button
            key={team._id}
            onClick={() => {
              setSelectedTeam(team);
              setIsDrawingActive(false); 
            }}
            className={`block w-full text-left px-4 py-3 rounded border ${
              selectedTeam?._id === team._id ? "bg-[#C99E77]" : "bg-white"
            }`}
          >
            <div className="text-xl font-semibold">{team.name}</div>
            <div className="text-sm text-gray-600">
              {team.members?.filter((id) => onlineUsers.includes(id)).length || 0} users online
            </div>
          </button>
        ))}
      </div>

      {selectedTeam && !isDrawingActive && (
        <div className="mt-6">
          <button
            onClick={handleStartDrawing}
            className="bg-[#69421E] text-white px-6 py-3 rounded hover:bg-[#573215] transition"
          >
            Start Drawing with {selectedTeam.name}
          </button>
        </div>
      )}

      {isDrawingActive && (
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-2">🎨 Collaborative Drawing</h2>
          <DrawingBoard />
        </div>
      )}
    </div>
  );
};

export default Games;
