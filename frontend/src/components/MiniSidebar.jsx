import React from 'react';
import { FaUsers, FaComments, FaGamepad, FaUser } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';

const tabs = [
  { id: 'teams', icon: <FaUsers />, label: 'Teams', route: '/teams' },
  { id: 'chats', icon: <FaComments />, label: 'Chats', route: '/users' },
  { id: 'games', icon: <FaGamepad />, label: 'Games', route: '/games' },
  { id: 'profile', icon: <FaUser />, label: 'Profile', route: '/profile' },
];

const MiniSidebar = () => {
  const location = useLocation();

  return (
    <div className="bg-[#69421E] text-white w-16 h-screen flex flex-col items-center py-10 gap-8">
      {tabs.map((tab) => {
        const isActive = location.pathname.startsWith(tab.route);
        return (
          <Link
            key={tab.id}
            to={tab.route}
            className={`text-2xl transition-all hover:scale-125 ${
              isActive ? 'text-yellow-300' : ''
            }`}
            title={tab.label}
          >
            {tab.icon}
          </Link>
        );
      })}
    </div>
  );
};

export default MiniSidebar;
