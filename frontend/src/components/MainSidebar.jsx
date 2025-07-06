import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import { useTeamStore } from '../store/useTeamStore';

const MainSidebar = ({ activeTab }) => {
  const navigate = useNavigate(); 

  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
  } = useChatStore();

  const { onlineUsers } = useAuthStore();

  const {
    fetchTeams,
    teams,
    currentTeam,
    setCurrentTeam,
    isTeamsLoading,
  } = useTeamStore();

  useEffect(() => {
    getUsers();
    fetchTeams();
  }, [getUsers, fetchTeams]);

  useEffect(() => {
    if (activeTab === 'games') {
      navigate('/games');
    }
  }, [activeTab, navigate]);

  const renderUser = (user) => (
    <button
      key={user._id}
      onClick={() => setSelectedUser(user)}
      className={`flex gap-2 w-full text-left pb-1 pt-2 pl-1 border-b ${
        selectedUser?._id === user._id ? 'bg-[#C99E77]' : ''
      }`}
    >
      <div className="relative">
        {user.profilePic ? (
          <img
            src={user.profilePic}
            alt={user.profilePic}
            className="w-10 h-10 border border-2-[#69421E] rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 bg-[#69421E] rounded-full flex items-center justify-center text-white text-xl font-bold">
            {user.fullName.charAt(0).toUpperCase()}
          </div>
        )}
        {onlineUsers.includes(user._id) && (
          <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
        )}
      </div>
      {user.fullName}
    </button>
  );

  const renderTeam = (team) => (
    <button
      key={team._id}
      onClick={() => setCurrentTeam(team)}
      className={`w-full text-left pb-2 pt-2 pl-2 border-b ${
        currentTeam?._id === team._id ? 'bg-[#C99E77]' : ''
      }`}
    >
      <div className="text-xl font-semibold">{team.name}</div>
    </button>
  );

  return (
    <div className="custom-kodemono px-6 py-4 flex flex-col w-64 h-screen bg-[#E3BE9E] border border-l-[#69421E]">
      <div className='flex justify-between'>
        <h1 className="font-bold text-3xl border-b-2 mb-4 capitalize">{activeTab}</h1>
            {activeTab==='teams'?(<div onClick={()=>(navigate('/choose-team'))}
            className='h-10 w-10 bg-[#69421E] rounded-full text-white text-3xl text-center'>+</div>):<></>}
      </div>
      <div className="flex flex-col text-2xl gap-2 overflow-y-auto">
        {activeTab === 'teams' ? (
          isTeamsLoading ? (
            <div>Loading teams...</div>
          ) : (
            teams.map(renderTeam)
          )
        ) : activeTab === 'chats' ? (
          isUsersLoading ? (
            <div>Loading users...</div>
          ) : (
            users.map(renderUser)
          )
        ) : (
          <div className="text-gray-600 text-lg mt-10 text-center">Coming Soon</div>
        )}
      </div>
    </div>
  );
};

export default MainSidebar;
