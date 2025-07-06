import React, { useState } from 'react';
import { useTeamStore } from '../store/useTeamStore';
import toast from 'react-hot-toast';

const ChooseTeam = () => {
  const [showJoinCodeInput, setShowJoinCodeInput] = useState(false);
  const [showCreateTeamInput, setShowCreateTeamInput] = useState(false);
  const [teamdata,setTeamdata]=useState({
        name:"",description:""
      })
  const {joinTeam,createTeam,isLoading}=useTeamStore();
  const [inviteCode, setInviteCode] = useState('');

  const handleJoinSubmit = async () => {
    if (!inviteCode.trim()) {
      toast.error("Invite code is required");
      return;
    }
    console.log('Joining with code:', inviteCode);
    const success=await  joinTeam(inviteCode);
    if(success){
      setInviteCode("");
    setShowJoinCodeInput(false);
    }
    
  };
  const handleCreateSubmit=async ()=>{
    if (!teamdata.name.trim()) {
      toast.error("Team name is required");
      return;
    }
    const success = await createTeam(teamdata); 
  if (success) {
    setTeamdata({ name: "", description: "" });
    setShowCreateTeamInput(false);
  }
    
  }

  return (
    <div className='custom-kodemono h-screen bg-[#EECEB1] flex flex-col justify-center items-center px-4'>
      <p className='text-[#69421E] mb-6 text-center max-w-md'>
        Join your team or create a new one to start collaborating.
      </p>

      <div className='flex flex-col gap-4 w-full max-w-sm'>
        <button onClick={()=>{
          setShowCreateTeamInput(!showCreateTeamInput)
        }}
        className='bg-[#69421E] rounded-2xl text-white px-4 py-3 hover:bg-[#4f3117] transition'>
          {showCreateTeamInput ? 'CANCEL' : 'CREATE A TEAM'}
          </button>

        {showCreateTeamInput && (
          <div className='flex flex-col gap-2 mt-2'>
            <input 
              type='text'
              value={teamdata.name}
              onChange={(e) => setTeamdata({...teamdata,name:e.target.value})}
              placeholder='Enter team name'
              className='px-4 py-2 rounded-xl border border-[#69421E] outline-none focus:ring-2 focus:ring-[#69421E]'
            />
            <input 
              type='text'
              value={teamdata.description}
              onChange={(e) => setTeamdata({...teamdata,description:e.target.value})}
              placeholder='Enter team description (Optional)'
              className='px-4 py-2 rounded-xl border border-[#69421E] outline-none focus:ring-2 focus:ring-[#69421E]'
            />
            <button 
              onClick={handleCreateSubmit}
              className='bg-[#69421E] rounded-xl text-white px-4 py-2 hover:bg-[#4f3117] transition'>
{isLoading ? "Creating..." : "CREATE TEAM"}            </button>
          </div>
        )}

        <button 
          onClick={() => setShowJoinCodeInput(!showJoinCodeInput)}
          className='bg-[#69421E] rounded-2xl text-white px-4 py-3 hover:bg-[#4f3117] transition'>
          {showJoinCodeInput ? 'CANCEL' : 'JOIN VIA CODE'}
        </button>

        {showJoinCodeInput && (
          <div className='flex flex-col gap-2 mt-2'>
            <input 
              type='text'
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              placeholder='Enter team code'
              className='px-4 py-2 rounded-xl border border-[#69421E] outline-none focus:ring-2 focus:ring-[#69421E]'
            />
            <button 
              onClick={handleJoinSubmit}
              className='bg-[#69421E] rounded-xl text-white px-4 py-2 hover:bg-[#4f3117] transition'>
              JOIN TEAM
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChooseTeam;
