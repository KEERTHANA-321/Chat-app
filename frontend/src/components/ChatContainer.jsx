import React, { useEffect } from 'react';
import { useChatStore } from '../store/useChatStore';
import { useTeamStore } from '../store/useTeamStore';
import MessageInput from './MessageInput';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageSkeleton from './MessageSkeleton';
import { useLocation } from 'react-router-dom';

const ChatContainer = () => {
  const { getMessages, isMessagesLoading, selectedUser } = useChatStore();
  const { currentTeam } = useTeamStore();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname=="/users") {
      getMessages(selectedUser._id, 'user');
    } else if (location.pathname=="/teams") {
      getMessages(currentTeam._id, 'team');
    }
  }, [getMessages, selectedUser, currentTeam, location.pathname]);

  return (
    <div className="h-full w-full flex flex-col">
      
      {/* ✅ Fixed Chat Header */}
      <div className="shrink-0">
        <ChatHeader />
      </div>

      {/* ✅ Scrollable message area */}
      <div className="flex-1 overflow-y-auto">
        {isMessagesLoading ? <MessageSkeleton /> : <MessageList />}
      </div>

      {/* ✅ Fixed input at bottom */}
      <div className="shrink-0">
        <MessageInput />
      </div>

    </div>
  );
};

export default ChatContainer;
