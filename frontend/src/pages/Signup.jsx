import React, { useState } from 'react';
import MouseTrail from '../components/MouseTrail';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { TbEyeClosed } from "react-icons/tb";
import { TbEye } from "react-icons/tb";
import toast from 'react-hot-toast';

const Signup = () => {
  const [showPassword,setShowpassword]=useState(false);
  const [formdata,setFormdata]=useState({
    fullName:"",email:"",password:""
  })

  const {signUp}=useAuthStore();
  const validateForm=()=>{
    if(!formdata.fullName.trim()) return toast.error("Full name is required");
    if(!formdata.email.trim()) return toast.error("Email is required");
    if(!/\S+@\S+\.\S+/.test(formdata.email)) return toast.error("Invalid email format");
    if(!formdata.password) return toast.error("Password is required");
    if(formdata.password.length<6) return toast.error("Password length must be minimum 6")
      return true;
    
  };
  const handleSubmit=(e)=>{
    e.preventDefault();
    const success=validateForm();
    if(success===true) signUp(formdata)
  }
  return (
    <div className="relative h-screen bg-[#69421E] overflow-hidden custom-kodemono text-white">
      {/* Background Animation */}
      

      {/* Main Content Layer */}
      <div className="flex h-full relative z-10 ">
        {/* Left Side */}
        <div className="flex items-center justify-center w-1/2 border-r border-white">
          <div className="backdrop-blur-lg bg-[#935d2bcd] h-2/3 w-1/2 rounded-lg px-10  flex flex-col items-center justify-center">
          <h1 className='text-2xl mb-10 border-b  border-b-white '>Get Started!</h1>
          <form className='flex-col flex  gap-4'>
          <input type='text' 
          value={formdata.fullName}
          onChange={(e)=>setFormdata({...formdata,fullName:e.target.value})}

          placeholder='Name' 
          className='custom-kodemono bg-transparent  text-white placeholder-white px-2 py-1 custom-kodemono focus:outline-none focus:ring-0 focus:border-b-2 focus:border-white'/>
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
            <button onClick={handleSubmit}className='border border-white px-4 py-2'>SignUp</button>
          </form>
          <p className='text-xs py-5'>Already have an account? <Link to="/login" className='cursor-pointer hover:border-b hover:border-b-white-2'>Login</Link></p>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-1/2 relative overflow-hidden flex flex-col items-center justify-center ">
        <MouseTrail />
        <h1 className="custom-kodemono text-white text-5xl">HANGOUT</h1>

        <div className='absolute flex gap-10 bottom-5 right-5 justify-between'>
        <Link to="/about" className="hover:underline">About</Link>
  <Link to="/contact" className="hover:underline">Contact</Link>
  <Link to="/features" className="hover:underline">Features</Link>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
