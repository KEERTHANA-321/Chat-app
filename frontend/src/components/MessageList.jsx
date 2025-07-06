import React, { useEffect, useRef } from 'react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';


const MessageList = () => {
  const { authUser } = useAuthStore();
  const { messages } = useChatStore();
  const messageEndRef = useRef(null);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="space-y-4  px-4 py-2">
      {messages.map((msg, index) => {
        const isSender =
          msg.senderId?._id === authUser._id || msg.senderId === authUser._id;

        // Attach ref only to the last message for scrolling
        const isLastMessage = index === messages.length - 1;

        return (
          <div
            key={msg._id}
            className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
            ref={isLastMessage ? messageEndRef : null}
          >
            {!isSender && (
              <p className="text-sm text-[#69421E] font-semibold mb-1">
                {msg.senderId?.fullName}
              </p>
            )}

            <div
              className={`max-w-xs md:max-w-sm p-3 ${
                isSender
                  ? 'bg-[#69421E] text-white rounded-l-xl rounded-b-xl'
                  : 'bg-white text-[#69421E] border border-[#69421E] rounded-e-xl rounded-es-xl'
              }`}
            >
              {msg.image && (
                <img
                  src={msg.image}
                  alt="Sent"
                  className="mb-2 rounded-md max-w-full"
                />
              )}
              <p className="whitespace-pre-wrap">{msg.text}</p>
              <span className="text-xs text-white mt-1 ml-1">
                {formatTime(msg.createdAt)}
              </span>
            </div>

            <img
              src={
                isSender
                  ? authUser?.profilePic || '/default-avatar.png'
                  : msg.senderId?.profilePic || '/default-avatar.png'
              }
              alt="profilepic"
              className="rounded-full h-10 w-10 border border-[#69421E]"
            />
          </div>
        );
      })}
    </div>
  );
};


export default MessageList;
