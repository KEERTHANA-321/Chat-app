import React from 'react';
import ChatContainer from '../components/ChatContainer';
import NoChatSelected from '../components/NoChatSelected';
import { useChatStore } from '../store/useChatStore';

const UsersPage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="flex h-full w-full overflow-hidden">
      <div className="flex-1 h-full">
        {selectedUser ? <ChatContainer /> : <NoChatSelected />}
      </div>
    </div>
  );
};

export default UsersPage;
