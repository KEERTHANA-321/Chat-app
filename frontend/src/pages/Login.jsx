import React, { useState } from 'react';
import MouseTrail from '../components/MouseTrail';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';
import { TbEyeClosed } from "react-icons/tb";
import { TbEye } from "react-icons/tb";


const Login = () => {
  const [showPassword,setShowpassword]=useState(false);
    const [formdata,setFormdata]=useState({
      email:"",password:""
    })
  
  const {logIn}=useAuthStore();
  const validateForm=()=>{
    if(!formdata.email.trim()) return toast.error("Email is required");
    if(!/\S+@\S+\.\S+/.test(formdata.email)) return toast.error("Invalid email format");
    if(!formdata.password) return toast.error("Password is required");
    return true;
    
  };
  const handleSubmit=(e)=>{
    e.preventDefault();
    const success=validateForm();
    if(success===true) logIn(formdata)
  }
  return (
    <div className="relative h-screen bg-[#69421E] overflow-hidden custom-kodemono text-white">
      {/* Background Animation */}
      

      {/* Main Content Layer */}
      <div className="flex h-full relative z-10 ">
        {/* Left Side */}
        <div className="flex items-center justify-center w-1/2 border-r border-white">
          <div className="backdrop-blur-lg bg-[#935d2bcd] h-2/3 w-1/2 rounded-lg px-10  flex flex-col items-center justify-center">
          <h1 className='text-2xl mb-10 border-b  border-b-white '>Welcome Back!</h1>
          <form className='flex-col flex  gap-4'>            
            <input type='text' placeholder='Email ID'
                        value={formdata.email}
                        onChange={(e)=>setFormdata({...formdata,email:e.target.value})}
            
                        className='custom-kodemono bg-transparent  text-white placeholder-white px-2 py-1 custom-kodemono focus:outline-none focus:ring-0 focus:border-b-2 focus:border-white'/>
                        <div className='flex justify-between'>
                          <input type={showPassword?"text":"password"} 
                        value={formdata.password} 
                        placeholder='Password' 
                        onChange={(e)=>setFormdata({...formdata,password:e.target.value})}
                        className='custom-kodemono bg-transparent  text-white placeholder-white px-2 py-1 custom-kodemono focus:outline-none focus:ring-0 focus:border-b-2 focus:border-white'/>
                        <button type="button" onClick={()=>setShowpassword(!showPassword)}>{showPassword?(<TbEye className="size-5"/>):(<TbEyeClosed className="size-5"/>)}</button>
                        </div>
                        <button onClick={handleSubmit}className='border border-white px-4 py-2'>Login</button>
                      </form>
          <p className='text-xs py-5'>Don't have an account? <Link to="/signup" className='cursor-pointer hover:border-b hover:border-b-white-2'>Signup</Link></p>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-1/2 relative overflow-hidden flex items-center justify-center">
        <MouseTrail />
          <h1 className="custom-kodemono text-white text-5xl">HANGOUT</h1>
        </div>
      </div>
    </div>
  );
};

export default Login;
