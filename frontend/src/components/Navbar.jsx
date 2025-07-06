import React, { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore';


const Navbar = ({className}) => {
  const location=useLocation();
  
  const { logOut ,authUser} = useAuthStore();
  const navigate=useNavigate();
  const handleLogout = async () => {
    await logOut(); 
  };
  useEffect(() => {
    if (!authUser && location.pathname !== "/login" && location.pathname !== "/signup") {
      navigate("/login")
    }
  }, [authUser,navigate])
  if(location.pathname=="/login" || location.pathname=="/signup"){
    return <></>
  }
  return (
    <div className={`fixed top-0 left-0 w-full z-50 bg-[#69421E] text-white py-2 px-4 flex justify-between custom-kodemono  ${className}`}>
      <h1 className=" text-white text-2xl">HANGOUT</h1>
      <div className='flex gap-5'>
      <Link to="/choose-team">Teams</Link>
        <Link>Settings</Link>
        <Link to="/profile">Profile</Link>
        <h1 className=""  onClick={handleLogout}>Logout</h1>
      </div>



    </div>
  )
}

export default Navbar