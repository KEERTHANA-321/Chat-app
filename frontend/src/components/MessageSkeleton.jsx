import React from 'react';

const MessageSkeleton = () => {
  const skeletonMessages = Array(6).fill(null);

  return (
    <div className="px-4 py-2 space-y-3 animate-pulse">
      {skeletonMessages.map((_, idx) => (
        <div
          key={idx}
          className={`flex ${idx % 2 === 0 ? 'justify-start' : 'justify-end'}`}
        >
          <div
            className={`rounded-xl bg-zinc-300 dark:bg-zinc-700 h-5 ${idx % 2 === 0 ? 'w-2/3' : 'w-1/2'}`}
          ></div>
        </div>
      ))}
    </div>
  );
};

export default MessageSkeleton;
