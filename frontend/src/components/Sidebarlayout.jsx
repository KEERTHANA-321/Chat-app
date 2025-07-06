import React from 'react';
import MiniSidebar from './MiniSidebar';
import MainSidebar from './MainSidebar';
import { Outlet, useLocation } from 'react-router-dom';

const SidebarLayout = () => {
  const location = useLocation();
  const path = location.pathname;

  let activeTab = 'teams';
  if (path.includes('/users')) activeTab = 'chats';
  else if (path.includes('/teams')) activeTab = 'teams';

  return (
    <div className="flex h-screen w-full overflow-hidden"> {/* ✅ FIXED */}
      <MiniSidebar activeTab={activeTab} />
      {activeTab !== 'games' && activeTab !== 'profile' && (
        <MainSidebar activeTab={activeTab} />
      )}
      <div className="flex-1 h-full w-full overflow-hidden"> {/* ✅ FIXED */}
        <Outlet />
      </div>
    </div>
  );
};


export default SidebarLayout;
