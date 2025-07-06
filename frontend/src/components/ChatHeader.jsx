import React, { useState, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useTeamStore } from "../store/useTeamStore";
import { useAuthStore } from "../store/useAuthStore";
import Modal from "./Modal";
import TeamMembersList from "./TeamMemberList";
import { MoreVertical } from "lucide-react"; // optional: 3-dot icon

const ChatHeader = () => {
  const { selectedUser } = useChatStore();
  const { currentTeam, members, getTeamMembers, isMembersLoading } = useTeamStore();
  const { onlineUsers } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    if (isModalOpen && currentTeam?._id) {
      getTeamMembers(currentTeam._id);
    }
  }, [isModalOpen, currentTeam, getTeamMembers]);

  // ---- Chat with User ----
  if (selectedUser) {
    return (
      <div className="custom-kodemono py-3 px-6 flex items-center justify-start bg-[#C99E77]">
        <img
          src={selectedUser.profilePic || "/default-avatar.png"}
          alt={selectedUser.fullName}
          className="w-12 h-12 border border-[#69421E] rounded-full object-cover"
        />
        <div className="pl-4">
          <span className="text-2xl font-semibold">{selectedUser.fullName}</span>
          <p className="text-sm">{onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}</p>
        </div>
      </div>
    );
  }

  if (currentTeam) {
    return (
      <div className="custom-kodemono py-3 px-6 flex items-center justify-between bg-[#C99E77]">
        
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#69421E] rounded-full flex items-center justify-center text-white text-xl font-bold">
            {currentTeam.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <span className="text-2xl font-semibold">{currentTeam.name}</span>
            <p className="text-sm text-gray-800">{currentTeam.description || "No description"}</p>
          </div>
        </div>

        
        <div className="relative">
          <button
            onClick={() => setShowOptions((prev) => !prev)}
            className="p-2 rounded-full hover:bg-[#b68f6e] transition"
            title="Team Options"
          >
            <MoreVertical className="w-6 h-6 text-[#69421E]" />
          </button>

          {showOptions && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
              <div className="px-4 py-3 text-sm text-gray-700 border-b">
                Invite Code: <strong>{currentTeam.inviteCode || "N/A"}</strong>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(true);
                  setShowOptions(false);
                }}
                className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100"
              >
                View Team Members
              </button>
            </div>
          )}
        </div>

        {/* Team Members Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Team Members">
          {isMembersLoading ? (
            <p>Loading members...</p>
          ) : (
            <TeamMembersList members={members} />
          )}
        </Modal>
      </div>
    );
  }

  return (
    <div className="custom-kodemono py-3 flex bg-[#C99E77] justify-center items-center">
      <p className="text-lg text-gray-700">No chat selected</p>
    </div>
  );
};

export default ChatHeader;
