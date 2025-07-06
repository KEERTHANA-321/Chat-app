import React, { useEffect } from 'react';
import ChatContainer from '../components/ChatContainer';
import NoChatSelected from '../components/NoChatSelected';
import { useTeamStore } from '../store/useTeamStore';
import { useChatStore } from '../store/useChatStore';
const TeamsPage = () => {
    const { currentTeam } = useTeamStore();
    const { setSelectedUser } = useChatStore(); // ✅ grab setter
    useEffect(() => {
      setSelectedUser(null);
    }, [setSelectedUser]);
  
    return (
      <div className="flex h-full w-full overflow-hidden"> {/* ✅ FIXED */}
        <div className="flex-1 h-full w-full">
          {currentTeam ? <ChatContainer /> : <NoChatSelected />}
        </div>
      </div>
    );
  };
  
  
  

export default TeamsPage;
